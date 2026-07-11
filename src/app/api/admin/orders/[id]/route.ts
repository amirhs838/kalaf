import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { getAdminToken } from "@/lib/auth";
import { mapOrder } from "@/lib/mappers";
import type { OrderStatus, OrderRow, OrderItemRow } from "@/lib/types";

const VALID: OrderStatus[] = [
  "pending_review",
  "payment_confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getAdminToken(req);
  if (!token) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }
  const { id } = await params;
  let body: { status?: string; sellerNote?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر" }, { status: 400 });
  }

  const updateObj: Record<string, unknown> = {};
  if (body.status) {
    if (!VALID.includes(body.status as OrderStatus)) {
      return NextResponse.json({ error: "وضعیت نامعتبر" }, { status: 400 });
    }
    updateObj.status = body.status;
  }
  if (typeof body.sellerNote === "string") {
    updateObj.seller_note = body.sellerNote.trim() || null;
  }

  if (Object.keys(updateObj).length === 0) {
    return NextResponse.json({ error: "هیچ فیلدی برای به‌روزرسانی ارسال نشده" }, { status: 400 });
  }

  const { data: updatedData, error: updateError } = await supabase
    .from("orders")
    .update(updateObj)
    .eq("id", id)
    .select("*")
    .single();
  if (updateError || !updatedData) {
    return NextResponse.json(
      { error: updateError?.message ?? "خطا در به‌روزرسانی سفارش" },
      { status: 500 }
    );
  }
  const updated = updatedData as OrderRow;

  const { data: itemsData, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", updated.id);
  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }
  const items = (itemsData as OrderItemRow[]) ?? [];

  return NextResponse.json({ order: mapOrder(updated, items) });
}
