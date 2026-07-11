import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { mapOrder } from "@/lib/mappers";
import type { OrderRow, OrderItemRow } from "@/lib/types";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim();
  const phone = req.nextUrl.searchParams.get("phone")?.trim();
  if (!code || !phone) {
    return NextResponse.json({ error: "کد سفارش و شماره تلفن الزامی است" }, { status: 400 });
  }
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("tracking_code", code)
    .maybeSingle();
  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }
  if (!orderData) {
    return NextResponse.json({ error: "سفارشی با این کد پیدا نشد" }, { status: 404 });
  }
  const order = orderData as OrderRow;
  if (order.phone.replace(/\D/g, "") !== phone.replace(/\D/g, "")) {
    return NextResponse.json({ error: "شماره تلفن با سفارش مطابقت ندارد" }, { status: 403 });
  }

  const { data: itemsData, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id);
  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }
  const items = (itemsData as OrderItemRow[]) ?? [];

  return NextResponse.json({ order: mapOrder(order, items) });
}
