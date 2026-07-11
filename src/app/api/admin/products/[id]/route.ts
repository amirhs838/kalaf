import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminToken } from "@/lib/auth";
import { mapProduct } from "@/lib/mappers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getAdminToken(req);
  if (!token) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }
  const { id } = await params;
  let body: { stock?: number; isFeatured?: boolean; isNew?: boolean; price?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر" }, { status: 400 });
  }
  const data: Record<string, unknown> = {};
  if (typeof body.stock === "number") data.stock = Math.max(0, Math.floor(body.stock));
  if (typeof body.isFeatured === "boolean") data.isFeatured = body.isFeatured;
  if (typeof body.isNew === "boolean") data.isNew = body.isNew;
  if (typeof body.price === "number") data.price = Math.max(0, Math.floor(body.price));

  const product = await db.product.update({ where: { id }, data });
  return NextResponse.json({ product: mapProduct(product) });
}
