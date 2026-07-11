import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mapOrder } from "@/lib/mappers";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "receipts");
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/gif"];
const MAX_BYTES = 6 * 1024 * 1024;

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
    return NextResponse.json({ error: "حجم فایل بیش از ۶ مگابایت است" }, { status: 400 });
  }
  const type = file.type || "image/jpeg";
  if (!ALLOWED.includes(type)) {
    return NextResponse.json({ error: "فقط فایل عکس مجاز است" }, { status: 400 });
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = type.split("/")[1] || "jpg";
  const safeName = `${trackingCode}-${Date.now()}.${ext}`;
  const filePath = path.join(UPLOAD_DIR, safeName);
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buf);

  const updated = await db.order.update({
    where: { id: order.id },
    data: {
      receiptPath: `/uploads/receipts/${safeName}`,
      receiptOriginalName: file.name,
      transactionCode: transactionCode || order.transactionCode,
      notes: note ? (order.notes ? `${order.notes}\n— ${note}` : note) : order.notes,
      // reset to pending_review if it was cancelled? keep current; but ensure status pending
      status: order.status === "pending_review" ? "pending_review" : order.status,
    },
    include: { items: true },
  });

  return NextResponse.json({ order: mapOrder(updated as never) });
}
