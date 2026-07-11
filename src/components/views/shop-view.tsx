"use client";

import { useMemo, useState } from "react";
import { useRouter } from "@/lib/router";
import { useApi } from "@/lib/use-api";
import { ProductCard } from "@/components/site/product-card";
import { StitchDivider } from "@/components/site/stitch-divider";
import { CATEGORY_LABELS, type Category, type Product } from "@/lib/types";
import { formatToman, toFa } from "@/lib/format";
import { SlidersHorizontal, X, ArrowRight, Home } from "lucide-react";

const COLORS = [
  { name: "کرم", hex: "#F3E7D2" },
  { name: "قهوه‌ای", hex: "#8A5A3B" },
  { name: "زنگاری", hex: "#C2703D" },
  { name: "صورتی خاکی", hex: "#D98C82" },
  { name: "سبز خزه‌ای", hex: "#8CA37A" },
  { name: "عسلی", hex: "#DDA53B" },
  { name: "سرمه‌ای", hex: "#8DA0BB" },
  { name: "خاکستری", hex: "#9A9A9A" },
  { name: "قرمز", hex: "#B5522E" },
];

export function ShopView({
  category,
  initialParams,
}: {
  category: string | null;
  initialParams: Record<string, string>;
}) {
  const { navigate } = useRouter();
  const [selCategory, setSelCategory] = useState<string>(category ?? "all");
  const [selColor, setSelColor] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [uniqueOnly, setUniqueOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const url = useMemo(() => {
    const params = new URLSearchParams();
    if (selCategory && selCategory !== "all") params.set("category", selCategory);
    if (selColor) params.set("color", selColor);
    if (minPrice) params.set("min", minPrice);
    if (maxPrice) params.set("max", maxPrice);
    if (availableOnly) params.set("available", "true");
    if (initialParams.q) params.set("q", initialParams.q);
    const qs = params.toString();
    return `/api/products${qs ? "?" + qs : ""}`;
  }, [selCategory, selColor, minPrice, maxPrice, availableOnly, initialParams.q]);

  const { data, loading } = useApi<{ products: Product[] }>(url);

  let products = data?.products ?? [];
  if (uniqueOnly) products = products.filter((p) => p.isUnique);

  const title =
    category && category !== "all"
      ? CATEGORY_LABELS[category as Category] ?? "همه‌ی محصولات"
      : "همه‌ی محصولات";

  const clearFilters = () => {
    setSelCategory("all");
    setSelColor("");
    setMinPrice("");
    setMaxPrice("");
    setAvailableOnly(false);
    setUniqueOnly(false);
  };

  const FiltersPanel = (
    <div className="space-y-6">
      {/* category */}
      <div>
        <h4 className="font-bold text-ink text-sm mb-3" style={{ fontFamily: "var(--font-display)" }}>
          دسته‌بندی
        </h4>
        <div className="flex flex-col gap-1.5">
          {[
            { v: "all", l: "همه" },
            { v: "doll", l: CATEGORY_LABELS.doll },
            { v: "bag", l: CATEGORY_LABELS.bag },
            { v: "knitwear", l: CATEGORY_LABELS.knitwear },
          ].map((c) => (
            <button
              key={c.v}
              onClick={() => setSelCategory(c.v)}
              className={`text-right text-sm px-3 py-2 rounded-xl transition-colors ${
                selCategory === c.v ? "bg-clay text-white font-bold" : "text-ink/75 hover:bg-cream"
              }`}
            >
              {c.l}
            </button>
          ))}
        </div>
      </div>

      <StitchDivider />

      {/* color */}
      <div>
        <h4 className="font-bold text-ink text-sm mb-3" style={{ fontFamily: "var(--font-display)" }}>
          رنگ
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelColor("")}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              !selColor ? "bg-ink text-canvas border-ink" : "border-kraft text-ink/70 hover:bg-cream"
            }`}
          >
            همه
          </button>
          {COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelColor(selColor === c.name ? "" : c.name)}
              className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border transition-colors ${
                selColor === c.name
                  ? "border-ink bg-cream font-bold"
                  : "border-kraft text-ink/70 hover:bg-cream"
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-ink/15"
                style={{ background: c.hex }}
              />
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <StitchDivider />

      {/* price */}
      <div>
        <h4 className="font-bold text-ink text-sm mb-3" style={{ fontFamily: "var(--font-display)" }}>
          بازه قیمت (تومان)
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="از"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full bg-surface border border-kraft rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
          />
          <span className="text-muted-foreground">—</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="تا"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-surface border border-kraft rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
          />
        </div>
      </div>

      <StitchDivider />

      {/* toggles */}
      <div className="space-y-2.5">
        <label className="flex items-center gap-2.5 cursor-pointer text-sm text-ink/80">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
            className="w-4 h-4 accent-clay"
          />
          فقط موجودها
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer text-sm text-ink/80">
          <input
            type="checkbox"
            checked={uniqueOnly}
            onChange={(e) => setUniqueOnly(e.target.checked)}
            className="w-4 h-4 accent-clay"
          />
          فقط تک‌نسخه‌ها
        </label>
      </div>

      <button
        onClick={clearFilters}
        className="text-sm text-clay font-bold hover:underline w-full text-center pt-2"
      >
        پاک کردن فیلترها
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8">
      {/* breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <button onClick={() => navigate("/")} className="inline-flex items-center gap-1 hover:text-clay">
          <Home size={13} /> خانه
        </button>
        <ArrowRight size={13} className="rotate-180" />
        <span className="text-ink font-bold">{title}</span>
      </nav>

      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink" style={{ fontFamily: "var(--font-display)" }}>
            {title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? "در حال بارگذاری..." : `${toFa(products.length)} محصول`}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(true)}
          className="lg:hidden inline-flex items-center gap-2 bg-surface border border-kraft px-4 py-2.5 rounded-full text-sm font-bold text-ink"
        >
          <SlidersHorizontal size={16} /> فیلترها
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* desktop sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-20 bg-surface border border-kraft rounded-2xl p-5">{FiltersPanel}</div>
        </aside>

        {/* mobile drawer */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-[60] bg-ink/40" onClick={() => setShowFilters(false)}>
            <div
              className="absolute inset-x-0 bottom-0 bg-surface rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-ink" style={{ fontFamily: "var(--font-display)" }}>
                  فیلترها
                </h3>
                <button onClick={() => setShowFilters(false)} className="w-9 h-9 rounded-full hover:bg-cream flex items-center justify-center">
                  <X size={18} />
                </button>
              </div>
              {FiltersPanel}
              <button
                onClick={() => setShowFilters(false)}
                className="mt-5 w-full bg-clay text-white py-3 rounded-full font-bold"
              >
                نمایش {toFa(products.length)} محصول
              </button>
            </div>
          </div>
        )}

        {/* grid */}
        <div className="lg:col-span-9">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-cream animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-surface border border-dashed border-kraft rounded-3xl">
              <div className="text-5xl mb-3">🧶</div>
              <p className="text-ink font-bold mb-1">هیچ محصولی با این فیلترها پیدا نشد</p>
              <p className="text-sm text-muted-foreground mb-4">شاید فیلترها رو کمی تغییر بدی؟</p>
              <button onClick={clearFilters} className="text-clay font-bold hover:underline">
                پاک کردن فیلترها
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
