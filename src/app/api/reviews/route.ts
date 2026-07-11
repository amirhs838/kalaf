import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mapReview } from "@/lib/mappers";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ reviews: [] });
  }
  const reviews = await db.review.findMany({
    where: { productId, approved: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ reviews: reviews.map(mapReview) });
}

export async function POST(req: NextRequest) {
  let body: { productId?: string; customerName?: string; rating?: number; comment?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر" }, { status: 400 });
  }
  const { productId, customerName, rating, comment } = body;
  if (!productId || !customerName?.trim() || !comment?.trim()) {
    return NextResponse.json({ error: "همه‌ی فیلدها الزامی است" }, { status: 400 });
  }
  const r = Math.max(1, Math.min(5, Math.floor(Number(rating) || 5)));
  const review = await db.review.create({
    data: {
      productId,
      customerName: customerName.trim(),
      rating: r,
      comment: comment.trim(),
      images: "[]",
      approved: false,
    },
  });
  return NextResponse.json({ review: mapReview(review) }, { status: 201 });
}
