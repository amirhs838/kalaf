import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { getAdminToken } from "@/lib/auth";
import { mapOrder } from "@/lib/mappers";
import type { OrderRow, OrderItemRow } from "@/lib/types";

export async function GET(req: NextRequest) {
  const token = await getAdminToken(req);
  if (!token) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }
  const status = req.nextUrl.searchParams.get("status");

  let query = supabase.from("orders").select("*");
  if (status && status !== "all") {
    query = query.eq("status", status);
  }
  query = query.order("created_at", { ascending: false });

  const { data: ordersData, error: ordersError } = await query;
  if (ordersError) {
    return NextResponse.json({ error: ordersError.message }, { status: 500 });
  }
  const orders = (ordersData as OrderRow[]) ?? [];

  const itemsByOrderId: Record<string, OrderItemRow[]> = {};
  if (orders.length > 0) {
    const orderIds = orders.map((o) => o.id);
    const { data: itemsData, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .in("order_id", orderIds);
    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }
    for (const item of (itemsData as OrderItemRow[]) ?? []) {
      if (!itemsByOrderId[item.order_id]) itemsByOrderId[item.order_id] = [];
      itemsByOrderId[item.order_id].push(item);
    }
  }

  return NextResponse.json({
    orders: orders.map((o) => mapOrder(o, itemsByOrderId[o.id] || [])),
  });
}
