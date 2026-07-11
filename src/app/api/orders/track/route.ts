import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mapOrder } from "@/lib/mappers";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim();
  const phone = req.nextUrl.searchParams.get("phone")?.trim();
  if (!code || !phone) {
    return NextResponse.json({ error: "کد سفارش و شماره تلفن الزامی است" }, { status: 400 });
  }
  const order = await db.order.findUnique({
    where: { trackingCode: code },
    include: { items: true },
  });
  if (!order) {
    return NextResponse.json({ error: "سفارشی با این کد پیدا نشد" }, { status: 404 });
  }
  if (order.phone.replace(/\D/g, "") !== phone.replace(/\D/g, "")) {
    return NextResponse.json({ error: "شماره تلفن با سفارش مطابقت ندارد" }, { status: 403 });
  }
  return NextResponse.json({ order: mapOrder(order as never) });
}
