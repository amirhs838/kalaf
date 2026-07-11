import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { mapProduct, mapReview } from "@/lib/mappers";
import type { ProductRow, ReviewRow } from "@/lib/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 500 });
  }
  if (!product) {
    return NextResponse.json({ error: "محصول پیدا نشد" }, { status: 404 });
  }

  const productRow = product as ProductRow;

  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productRow.id)
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (reviewsError) {
    return NextResponse.json({ error: reviewsError.message }, { status: 500 });
  }

  return NextResponse.json({
    product: mapProduct(productRow),
    reviews: (reviews as ReviewRow[]).map(mapReview),
  });
}
