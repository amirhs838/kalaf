"use client";

import { useState, useRef } from "react";
import { useRouter } from "@/lib/router";
import { useApi, api } from "@/lib/use-api";
import { useCart } from "@/lib/store";
import { formatToman, toFa, formatFaDate } from "@/lib/format";
import { CATEGORY_LABELS, type Product, type Review } from "@/lib/types";
import { StitchDivider } from "@/components/site/stitch-divider";
import { ProductCard } from "@/components/site/product-card";
import {
  ArrowRight, Home, Minus, Plus, ShoppingBag, Star, Heart, Truck,
  Clock, Scissors, Palette, Send, Check, ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";

function Stars({ value, onChange, size = 18 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" dir="ltr">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
          aria-label={`${toFa(n)} ستاره`}
        >
          <Star
            size={size}
            className={n <= value ? "fill-honey text-honey" : "text-kraft"}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductView({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const addItem = useCart((s) => s.addItem);
  const { data, loading, error } = useApi<{ product: Product; reviews: Review[] }>(
    `/api/products/${slug}`
  );
  const related = useApi<{ products: Product[] }>(
    data?.product ? `/api/products?category=${data.product.category}&limit=5` : null
  );

  const [activeImg, setActiveImg] = useState(0);
  const [selColor, setSelColor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLDivElement>(null);

  const product = data?.product;
  const reviews = data?.reviews ?? [];

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square rounded-3xl bg-cream animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-cream rounded-xl animate-pulse w-2/3" />
            <div className="h-6 bg-cream rounded-xl animate-pulse w-1/3" />
            <div className="h-24 bg-cream rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-md text-center py-24 px-4">
        <div className="text-5xl mb-3">🧶</div>
        <h1 className="text-xl font-extrabold text-ink mb-2" style={{ fontFamily: "var(--font-display)" }}>
          محصول پیدا نشد
        </h1>
        <button onClick={() => navigate("/shop")} className="text-clay font-bold hover:underline">
          برگشت به فروشگاه
        </button>
      </div>
    );
  }

  const soldOut = product.stock <= 0;
  const colors = product.colors;
  const activeColor = selColor ?? colors[0] ?? null;

  const handleAdd = () => {
    if (soldOut) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? "",
      unitPrice: product.price,
      quantity: qty,
      options: activeColor,
    });
    toast.success("رفت تو سبد!", { description: `${toFa(qty)} عدد ${product.name}` });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const relatedProducts = (related.data?.products ?? []).filter((p) => p.id !== product.id).slice(0, 4);
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8">
      {/* breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5 flex-wrap">
        <button onClick={() => navigate("/")} className="inline-flex items-center gap-1 hover:text-clay">
          <Home size={13} /> خانه
        </button>
        <ArrowRight size={13} className="rotate-180" />
        <button onClick={() => navigate(`/category/${product.category}`)} className="hover:text-clay">
          {CATEGORY_LABELS[product.category]}
        </button>
        <ArrowRight size={13} className="rotate-180" />
        <span className="text-ink font-bold truncate max-w-[12rem]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* gallery */}
        <div className="flex flex-col gap-3">
          <div
            ref={imgRef}
            className="relative aspect-square rounded-[22px_28px_22px_26px] overflow-hidden bg-cream border border-kraft cursor-zoom-in"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={onMouseMove}
          >
            <img
              src={product.images[activeImg]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-200"
              style={
                zoom
                  ? { transform: `scale(2)`, transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                  : undefined
              }
            />
            {/* badges */}
            <div className="absolute top-3 inset-inline-start-3 flex flex-col gap-1.5">
              {product.isUnique && (
                <span className="bg-navy text-white text-[0.62rem] font-bold px-2.5 py-1 rounded-full">
                  تک‌نسخه
                </span>
              )}
              {product.isNew && (
                <span className="bg-honey text-ink text-[0.62rem] font-bold px-2.5 py-1 rounded-full">
                  تازه
                </span>
              )}
            </div>
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${
                    activeImg === i ? "border-clay" : "border-kraft hover:border-kraft/60"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-clay bg-cream px-2.5 py-1 rounded-full">
              {CATEGORY_LABELS[product.category]}
            </span>
            {reviews.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Stars value={Math.round(avgRating)} size={13} />
                {toFa(reviews.length)} نظر
              </span>
            )}
          </div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-ink leading-tight mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {product.name}
          </h1>
          <p className="text-clay text-2xl font-extrabold mb-5" style={{ fontFamily: "var(--font-display)" }}>
            {formatToman(product.price)}
          </p>

          <p className="text-ink/75 leading-8 mb-6">{product.description}</p>

          {/* color options */}
          {colors.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-bold text-ink mb-2" style={{ fontFamily: "var(--font-display)" }}>
                رنگ: <span className="text-muted-foreground font-normal">{activeColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelColor(c)}
                    className={`text-sm px-3.5 py-2 rounded-full border-2 transition-colors ${
                      activeColor === c
                        ? "border-clay bg-cream font-bold text-ink"
                        : "border-kraft text-ink/70 hover:bg-cream"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* quantity + add */}
          <div className="flex items-center gap-3 mb-3">
            <div className="inline-flex items-center bg-surface border border-kraft rounded-full overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-11 flex items-center justify-center hover:bg-cream text-ink"
                aria-label="کمتر"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-bold text-ink">{toFa(qty)}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                className="w-10 h-11 flex items-center justify-center hover:bg-cream text-ink"
                aria-label="بیشتر"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={soldOut}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full font-bold transition-all ${
                soldOut
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-clay text-white hover:bg-clay/90 active:translate-y-0.5"
              }`}
            >
              <ShoppingBag size={18} />
              {soldOut ? "ناموجود" : "افزودن به سبد"}
            </button>
          </div>

          {product.customizable && !soldOut && (
            <button
              onClick={() => navigate("/contact")}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full font-bold bg-surface border border-kraft text-ink hover:bg-cream transition-colors mb-5"
            >
              <Palette size={17} className="text-rose" />
              سفارش رنگ/طرح دلخواه
            </button>
          )}

          {/* stock note */}
          {!soldOut && product.stock <= 2 && (
            <p className="text-xs text-rose font-bold mb-5 inline-flex items-center gap-1.5">
              <Heart size={13} className="fill-rose" />
              فقط {toFa(product.stock)} عدد مونده — هرچه زودتر خرید کنید!
            </p>
          )}

          <StitchDivider className="my-5" />

          {/* specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {product.materials && (
              <Spec icon={Scissors} label="متریال" value={product.materials} />
            )}
            {product.dimensions && (
              <Spec icon={Heart} label="ابعاد" value={product.dimensions} />
            )}
            <Spec
              icon={Clock}
              label="زمان آماده‌سازی"
              value={`${toFa(product.prepDays)} روز کاری`}
            />
            <Spec
              icon={Truck}
              label="ارسال"
              value="پست پیشتاز به سراسر ایران"
            />
          </div>

          {product.story && (
            <div className="mt-6 bg-cream/60 border border-kraft rounded-2xl p-4">
              <p className="text-xs font-bold text-clay mb-1.5 inline-flex items-center gap-1.5">
                <Star size={13} className="fill-honey text-honey" /> قصه‌ی این محصول
              </p>
              <p className="text-sm text-ink/80 leading-7">{product.story}</p>
            </div>
          )}
        </div>
      </div>

      {/* ============ REVIEWS ============ */}
      <section className="mt-14">
        <StitchDivider withButton className="mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <h2 className="text-xl font-extrabold text-ink mb-4" style={{ fontFamily: "var(--font-display)" }}>
              نظرات خریداران
            </h2>
            {reviews.length === 0 ? (
              <div className="text-center py-10 bg-surface border border-dashed border-kraft rounded-2xl">
                <p className="text-muted-foreground">هنوز نظری ثبت نشده. اولین نفر باش!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="bg-surface border border-kraft rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-ink" style={{ fontFamily: "var(--font-display)" }}>
                        {r.customerName}
                      </span>
                      <Stars value={r.rating} size={14} />
                    </div>
                    <p className="text-sm text-ink/80 leading-7">{r.comment}</p>
                    <p className="text-xs text-muted-foreground mt-2">{formatFaDate(r.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* submit review */}
          <div className="lg:col-span-5">
            <div className="bg-surface border border-kraft rounded-2xl p-5 sticky top-20">
              <h3 className="font-extrabold text-ink mb-3" style={{ fontFamily: "var(--font-display)" }}>
                نظرت رو بنویس
              </h3>
              <ReviewForm productId={product.id} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ RELATED ============ */}
      {relatedProducts.length > 0 && (
        <section className="mt-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-extrabold text-ink" style={{ fontFamily: "var(--font-display)" }}>
              شاید این‌ها هم بدردت بخوره
            </h2>
            <button
              onClick={() => navigate(`/category/${product.category}`)}
              className="inline-flex items-center gap-1 text-sm font-bold text-clay"
            >
              همه <ChevronLeft size={15} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Spec({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5 bg-surface border border-kraft rounded-xl p-3">
      <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center shrink-0">
        <Icon size={15} className="text-clay" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-ink font-medium leading-6">{value}</p>
      </div>
    </div>
  );
}

function ReviewForm({ productId }: { productId: string }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!name.trim() || !comment.trim()) {
      toast.error("اسم و نظرت رو بنویس");
      return;
    }
    setSubmitting(true);
    try {
      await api("/api/reviews", { body: { productId, customerName: name, rating, comment } });
      setDone(true);
      toast.success("نظرت ثبت شد!", { description: "بعد از تأیید نشون داده می‌شه." });
      setName("");
      setComment("");
      setRating(5);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 rounded-full bg-moss flex items-center justify-center mx-auto mb-3">
          <Check className="text-white" size={22} />
        </div>
        <p className="font-bold text-ink mb-1">ممنون از نظرت!</p>
        <p className="text-xs text-muted-foreground">بعد از تأیید، نظرت اینجا نمایش داده می‌شه.</p>
        <button onClick={() => setDone(false)} className="text-clay text-sm font-bold mt-3 hover:underline">
          نوشتن نظر دیگه
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="اسمت"
        className="w-full bg-canvas border border-kraft rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
      />
      <div className="flex items-center gap-2">
        <span className="text-sm text-ink/70">امتیاز:</span>
        <Stars value={rating} onChange={setRating} size={22} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="تجربه‌ت از این محصول..."
        rows={4}
        className="w-full bg-canvas border border-kraft rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40 resize-none"
      />
      <button
        onClick={submit}
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 bg-clay text-white py-2.5 rounded-full font-bold hover:bg-clay/90 disabled:opacity-60"
      >
        <Send size={15} />
        {submitting ? "در حال ارسال..." : "ارسال نظر"}
      </button>
    </div>
  );
}
