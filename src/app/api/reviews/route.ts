import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { mapReview } from "@/lib/mappers";
import type { ReviewRow } from "@/lib/types";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ reviews: [] });
  }
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("approved", true)
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ reviews: (data as ReviewRow[]).map(mapReview) });
}

export async function POST(req: NextRequest) {
  let body: { productId?: string; customerName?: string; rating?: number; comment?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر" }, { status: 400 });
  }
  const { productId, customerName, comment } = body;
  if (!productId || !customerName?.trim() || !comment?.trim()) {
    return NextResponse.json({ error: "همه‌ی فیلدها الزامی است" }, { status: 400 });
  }
  const r = Math.max(1, Math.min(5, Math.floor(Number(body.rating) || 5)));

  const row: Omit<ReviewRow, "id" | "created_at"> = {
    product_id: productId,
    customer_name: customerName.trim(),
    rating: r,
    comment: comment.trim(),
    images: "[]",
    approved: false,
  };

  const { data, error } = await supabase
    .from("reviews")
    .insert(row)
    .select("*")
    .single();
  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "خطا در ثبت نظر" },
      { status: 500 }
    );
  }
  return NextResponse.json({ review: mapReview(data as ReviewRow) }, { status: 201 });
}
