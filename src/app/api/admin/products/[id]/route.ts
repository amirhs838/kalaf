import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { getAdminToken } from "@/lib/auth";
import { mapProduct } from "@/lib/mappers";
import type { ProductRow } from "@/lib/types";

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

  const updateObj: Record<string, unknown> = {};
  if (typeof body.stock === "number") updateObj.stock = Math.max(0, Math.floor(body.stock));
  if (typeof body.isFeatured === "boolean") updateObj.is_featured = body.isFeatured;
  if (typeof body.isNew === "boolean") updateObj.is_new = body.isNew;
  if (typeof body.price === "number") updateObj.price = Math.max(0, Math.floor(body.price));

  if (Object.keys(updateObj).length === 0) {
    return NextResponse.json({ error: "هیچ فیلدی برای به‌روزرسانی ارسال نشده" }, { status: 400 });
  }

  const { data: updatedData, error: updateError } = await supabase
    .from("products")
    .update(updateObj)
    .eq("id", id)
    .select("*")
    .single();
  if (updateError || !updatedData) {
    return NextResponse.json(
      { error: updateError?.message ?? "خطا در به‌روزرسانی محصول" },
      { status: 500 }
    );
  }

  return NextResponse.json({ product: mapProduct(updatedData as ProductRow) });
}
