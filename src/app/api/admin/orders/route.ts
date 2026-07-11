import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminToken } from "@/lib/auth";
import { mapOrder } from "@/lib/mappers";

export async function GET(req: NextRequest) {
  const token = await getAdminToken(req);
  if (!token) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }
  const status = req.nextUrl.searchParams.get("status");
  const where = status && status !== "all" ? { status } : {};
  const orders = await db.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders: orders.map((o) => mapOrder(o as never)) });
}
