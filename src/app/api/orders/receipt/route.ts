import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mapOrder } from "@/lib/mappers";

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

  const order = await db.order.findUnique({
    where: { trackingCode },
    include: { items: true },
  });
  if (!order) {
    return NextResponse.json({ error: "سفارش پیدا نشد" }, { status: 404 });
  }
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

  const updated = await db.order.update({
    where: { id: order.id },
    data: {
      receiptPath: dataUrl,
      receiptOriginalName: file.name,
      transactionCode: transactionCode || order.transactionCode,
      notes: note ? (order.notes ? `${order.notes}\n— ${note}` : note) : order.notes,
      status: order.status === "pending_review" ? "pending_review" : order.status,
    },
    include: { items: true },
  });

  return NextResponse.json({ order: mapOrder(updated as never) });
}
