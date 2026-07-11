import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import { mapProduct } from "@/lib/mappers";
import type { ProductRow } from "@/lib/types";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const category = sp.get("category");
  const color = sp.get("color");
  const min = sp.get("min");
  const max = sp.get("max");
  const available = sp.get("available");
  const featured = sp.get("featured");
  const fresh = sp.get("new");
  const q = sp.get("q");
  const limit = sp.get("limit");

  let query = supabase.from("products").select("*");

  if (category && category !== "all") query = query.eq("category", category);
  if (featured === "true") query = query.eq("is_featured", true);
  if (fresh === "true") query = query.eq("is_new", true);
  if (available === "true") query = query.gt("stock", 0);
  if (min) query = query.gte("price", Number(min));
  if (max) query = query.lte("price", Number(max));
  if (limit) query = query.limit(Number(limit));

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let result = (data as ProductRow[]).map(mapProduct);

  if (color) {
    result = result.filter((p) =>
      p.colors.some((c) => c.includes(color) || color.includes(c))
    );
  }
  if (q) {
    const needle = q.trim();
    result = result.filter(
      (p) => p.name.includes(needle) || p.description.includes(needle)
    );
  }

  return NextResponse.json({ products: result });
}
