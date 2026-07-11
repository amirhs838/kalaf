"use client";

import { useState } from "react";
import { useRouter } from "@/lib/router";
import { useCart } from "@/lib/store";
import { formatToman, toFa } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";

function rotFromSlug(slug: string, index = 0): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  const a = Math.abs(h);
  const mag = 1.9 + (a % 140) / 100; // 1.9 .. 3.3 deg — visibly handmade
  // alternate sign by grid position so neighbouring cards tilt opposite ways
  const sign = index % 2 === 0 ? 1 : -1;
  return sign * mag;
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { navigate } = useRouter();
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const rot = rotFromSlug(product.slug, index);
  const soldOut = product.stock <= 0;
  const lowStock = !soldOut && product.stock <= 2;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (soldOut) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? "",
      unitPrice: product.price,
      quantity: 1,
      options: product.colors[0] ? product.colors[0] : null,
    });
    setAdded(true);
    toast.success(`${product.name} اضافه شد`, { description: "رفت تو سبد کاموا" });
    setTimeout(() => setAdded(false), 1400);
  };

  const img = hovered && product.images[1] ? product.images[1] : product.images[0];

  return (
    <article
      className="tag-card tag-hole relative cursor-pointer p-3 pt-7 flex flex-col transition-transform"
      style={{
        transform: `rotate(${hovered ? rot - 0.7 : rot}deg) translateY(${hovered ? -4 : 0}px)`,
      }}
      onClick={() => navigate(`/product/${product.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="link"
      aria-label={product.name}
    >
      {/* badges */}
      <div className="absolute top-2.5 inset-inline-end-3 z-10 flex flex-col items-end gap-1.5">
        {product.isUnique && (
          <span className="torn-corner bg-navy text-white text-[0.62rem] font-bold px-2.5 py-1 pr-2.5 shadow-sm">
            تک‌نسخه
          </span>
        )}
        {product.isNew && !product.isUnique && (
          <span className="bg-honey text-ink text-[0.62rem] font-bold px-2 py-1 rounded-full shadow-sm">
            تازه
          </span>
        )}
        {lowStock && (
          <span className="bg-rose/90 text-white text-[0.6rem] font-bold px-2 py-0.5 rounded-full shadow-sm">
            تنها {toFa(product.stock)} عدد
          </span>
        )}
        {soldOut && (
          <span className="bg-ink/80 text-canvas text-[0.62rem] font-bold px-2 py-1 rounded-full">
            ناموجود
          </span>
        )}
      </div>

      {/* image */}
      <div className="relative overflow-hidden rounded-xl bg-cream aspect-square mb-3">
        {img ? (
          <img
            src={img}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 ease-out"
            style={{ transform: hovered ? "scale(1.04) rotate(-0.5deg)" : "scale(1)" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            بدون عکس
          </div>
        )}
      </div>

      {/* info */}
      <div className="flex flex-col gap-1 px-1 pb-1 grow">
        <h3
          className="text-ink text-[1.02rem] leading-snug line-clamp-2"
          style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
        >
          {product.name}
        </h3>
        <div className="flex items-end justify-between mt-1 gap-2">
          <span className="text-clay font-bold text-[1.05rem]" style={{ fontWeight: 700 }}>
            {formatToman(product.price)}
          </span>
          <button
            onClick={handleAdd}
            disabled={soldOut}
            aria-label={`افزودن ${product.name} به سبد`}
            className={`shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 ${
              soldOut
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : added
                ? "bg-moss text-white"
                : "bg-clay text-white hover:bg-clay/90 active:translate-y-0.5"
            }`}
          >
            {added ? <Check size={17} /> : <ShoppingBag size={16} />}
          </button>
        </div>
      </div>
    </article>
  );
}
