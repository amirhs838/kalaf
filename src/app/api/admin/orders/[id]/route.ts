import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminToken } from "@/lib/auth";
import { mapOrder } from "@/lib/mappers";
import type { OrderStatus } from "@/lib/types";

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
  const data: Record<string, unknown> = {};
  if (body.status) {
    if (!VALID.includes(body.status as OrderStatus)) {
      return NextResponse.json({ error: "وضعیت نامعتبر" }, { status: 400 });
    }
    data.status = body.status;
  }
  if (typeof body.sellerNote === "string") data.sellerNote = body.sellerNote.trim() || null;

  const order = await db.order.update({
    where: { id },
    data,
    include: { items: true },
  });
  return NextResponse.json({ order: mapOrder(order as never) });
}
