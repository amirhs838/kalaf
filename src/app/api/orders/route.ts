import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { shopConfig } from "@/lib/config";
import { generateTrackingCode } from "@/lib/format";
import { mapOrder } from "@/lib/mappers";
import type { CartItem, OrderRow, OrderItemRow, ProductRow } from "@/lib/types";

interface CreateOrderBody {
  customerName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode?: string;
  notes?: string;
  items: CartItem[];
  transactionCode?: string;
}

export async function POST(req: NextRequest) {
  let body: CreateOrderBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر" }, { status: 400 });
  }

  const required = ["customerName", "phone", "province", "city", "address", "items"];
  for (const f of required) {
    if (!body[f as keyof CreateOrderBody]) {
      return NextResponse.json({ error: `فیلد «${f}» الزامی است` }, { status: 400 });
    }
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "سبد خرید خالی است" }, { status: 400 });
  }

  const productIds = [...new Set(body.items.map((i) => i.productId))];
  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select("*")
    .in("id", productIds);
  if (productsError) {
    return NextResponse.json({ error: productsError.message }, { status: 500 });
  }
  const products = (productsData as ProductRow[]) ?? [];
  const productMap = new Map(products.map((p) => [p.id, p]));

  let itemsTotal = 0;
  const orderItemsData: {
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    options: string | null;
  }[] = [];

  for (const item of body.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return NextResponse.json({ error: "محصول نامعتبر" }, { status: 400 });
    }
    const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
    itemsTotal += product.price * qty;
    orderItemsData.push({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: qty,
      options: item.options ?? null,
    });
  }

  const shippingCost =
    itemsTotal >= shopConfig.freeShippingThreshold ? 0 : shopConfig.shippingBaseCost;
  const total = itemsTotal + shippingCost;

  let trackingCode = generateTrackingCode();
  while (true) {
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("tracking_code", trackingCode)
      .maybeSingle();
    if (!existing) break;
    trackingCode = generateTrackingCode();
  }

  const orderRow: Omit<OrderRow, "id" | "created_at" | "updated_at"> = {
    tracking_code: trackingCode,
    customer_name: body.customerName.trim(),
    phone: body.phone.trim(),
    province: body.province.trim(),
    city: body.city.trim(),
    address: body.address.trim(),
    postal_code: body.postalCode?.trim() || null,
    notes: body.notes?.trim() || null,
    items_total: itemsTotal,
    shipping_cost: shippingCost,
    total,
    status: "pending_review",
    receipt_path: null,
    receipt_original_name: null,
    transaction_code: body.transactionCode?.trim() || null,
    seller_note: null,
  };

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(orderRow)
    .select("*")
    .single();
  if (orderError || !order) {
    return NextResponse.json(
      { error: orderError?.message ?? "خطا در ثبت سفارش" },
      { status: 500 }
    );
  }
  const orderRowData = order as OrderRow;

  const orderItemRows = orderItemsData.map((i) => ({
    order_id: orderRowData.id,
    product_id: i.productId,
    product_name: i.productName,
    unit_price: i.unitPrice,
    quantity: i.quantity,
    options: i.options,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemRows);
  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  const { data: itemsData, error: itemsFetchError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderRowData.id);
  if (itemsFetchError) {
    return NextResponse.json({ error: itemsFetchError.message }, { status: 500 });
  }
  const items = (itemsData as OrderItemRow[]) ?? [];

  return NextResponse.json({ order: mapOrder(orderRowData, items) });
}
