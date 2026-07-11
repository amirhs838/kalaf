import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mapProduct } from "@/lib/mappers";
import type { Category } from "@/lib/types";

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

  const where: Record<string, unknown> = {};
  if (category && category !== "all") where.category = category as Category;
  if (featured === "true") where.isFeatured = true;
  if (fresh === "true") where.isNew = true;
  if (available === "true") where.stock = { gt: 0 };
  if (min || max) {
    const price: Record<string, number> = {};
    if (min) price.gte = Number(min);
    if (max) price.lte = Number(max);
    where.price = price;
  }

  const products = await db.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: Number(limit) } : {}),
  });

  let result = products.map(mapProduct);

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
