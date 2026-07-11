import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { mapOrder } from "@/lib/mappers";
import type { OrderRow, OrderItemRow } from "@/lib/types";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/gif"];
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB — keeps DB rows small on serverless

export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "فرم نامعتبر" }, { status: 400 });
  }

  const trackingCode = String(form.get("trackingCode") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const transactionCode = String(form.get("transactionCode") ?? "").trim();
  const note = String(form.get("note") ?? "").trim();

  if (!trackingCode || !phone) {
    return NextResponse.json({ error: "کد سفارش و شماره تلفن الزامی است" }, { status: 400 });
  }

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("tracking_code", trackingCode)
    .maybeSingle();
  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }
  if (!orderData) {
    return NextResponse.json({ error: "سفارش پیدا نشد" }, { status: 404 });
  }
  const order = orderData as OrderRow;

  if (order.phone.replace(/\D/g, "") !== phone.replace(/\D/g, "")) {
    return NextResponse.json({ error: "شماره تلفن با سفارش مطابقت ندارد" }, { status: 403 });
  }

  const file = form.get("receipt");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "فایل رسید آپلود نشده" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "فایل خالی است" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "حجم فایل بیش از ۲ مگابایت است" }, { status: 400 });
  }
  const type = file.type || "image/jpeg";
  if (!ALLOWED.includes(type)) {
    return NextResponse.json({ error: "فقط فایل عکس مجاز است" }, { status: 400 });
  }

  // Store as a base64 data URL directly in the DB. Vercel's filesystem is
  // read-only at runtime, so we can't write uploaded files to disk there.
  // Receipts are small payment screenshots (<2 MB), so this is fine.
  const buf = Buffer.from(await file.arrayBuffer());
  const dataUrl = `data:${type};base64,${buf.toString("base64")}`;

  const newNotes = note
    ? order.notes
      ? `${order.notes}\n— ${note}`
      : note
    : order.notes;

  const updateObj: Partial<OrderRow> = {
    receipt_path: dataUrl,
    receipt_original_name: file.name,
    transaction_code: transactionCode || order.transaction_code,
    notes: newNotes,
  };

  const { data: updatedData, error: updateError } = await supabase
    .from("orders")
    .update(updateObj)
    .eq("id", order.id)
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
