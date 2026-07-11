import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { shopConfig } from "@/lib/config";
import { generateTrackingCode } from "@/lib/format";
import { mapOrder } from "@/lib/mappers";
import type { CartItem } from "@/lib/types";

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
  const products = await db.product.findMany({ where: { id: { in: productIds } } });
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
  while (await db.order.findUnique({ where: { trackingCode } })) {
    trackingCode = generateTrackingCode();
  }

  const order = await db.order.create({
    data: {
      trackingCode,
      customerName: body.customerName.trim(),
      phone: body.phone.trim(),
      province: body.province.trim(),
      city: body.city.trim(),
      address: body.address.trim(),
      postalCode: body.postalCode?.trim() || null,
      notes: body.notes?.trim() || null,
      itemsTotal,
      shippingCost,
      total,
      status: "pending_review",
      transactionCode: body.transactionCode?.trim() || null,
      items: { create: orderItemsData },
    },
    include: { items: true },
  });

  return NextResponse.json({ order: mapOrder(order as never) });
}
