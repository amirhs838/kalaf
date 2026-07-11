import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mapProduct, mapReview } from "@/lib/mappers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) {
    return NextResponse.json({ error: "محصول پیدا نشد" }, { status: 404 });
  }
  const reviews = await db.review.findMany({
    where: { productId: product.id, approved: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({
    product: mapProduct(product),
    reviews: reviews.map(mapReview),
  });
}
