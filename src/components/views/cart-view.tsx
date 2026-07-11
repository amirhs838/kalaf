"use client";

import { useRouter } from "@/lib/router";
import { useCart, cartTotal } from "@/lib/store";
import { shopConfig } from "@/lib/config";
import { formatToman, toFa } from "@/lib/format";
import { StitchDivider } from "@/components/site/stitch-divider";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Truck, ArrowRight, Home } from "lucide-react";

export function CartView() {
  const { navigate } = useRouter();
  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const clear = useCart((s) => s.clear);

  const subtotal = cartTotal(items);
  const remaining = shopConfig.freeShippingThreshold - subtotal;
  const freeShip = remaining <= 0;
  const shipping = freeShip ? 0 : shopConfig.shippingBaseCost;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center py-20 px-4">
        <div className="w-20 h-20 rounded-full bg-cream border border-kraft flex items-center justify-center mx-auto mb-5">
          <ShoppingBag size={32} className="text-clay" />
        </div>
        <h1 className="text-2xl font-extrabold text-ink mb-2" style={{ fontFamily: "var(--font-display)" }}>
          سبدت خالیه
        </h1>
        <p className="text-muted-foreground mb-6">
          هنوز هیچ بافتنی‌ای انتخاب نکردی. بزن بریم سراغ محصولات!
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="inline-flex items-center gap-2 bg-clay text-white px-6 py-3 rounded-full font-bold hover:bg-clay/90 active:translate-y-0.5 transition-all"
        >
          <ShoppingBag size={18} />
          دیدن محصولات
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <button onClick={() => navigate("/")} className="inline-flex items-center gap-1 hover:text-clay">
          <Home size={13} /> خانه
        </button>
        <ArrowRight size={13} className="rotate-180" />
        <span className="text-ink font-bold">سبد خرید</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mb-6" style={{ fontFamily: "var(--font-display)" }}>
        سبد خرید ({toFa(items.length)} کالا)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* items */}
        <div className="lg:col-span-7 space-y-3">
          {/* free shipping progress */}
          {!freeShip && (
            <div className="bg-cream/70 border border-kraft rounded-2xl p-3.5">
              <p className="text-sm text-ink/80 mb-2 flex items-center gap-2">
                <Truck size={16} className="text-moss" />
                با {formatToman(remaining)} خرید بیشتر، ارسال رایگان می‌شه!
              </p>
              <div className="h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className="h-full bg-moss rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (subtotal / shopConfig.freeShippingThreshold) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {items.map((item) => (
            <div
              key={`${item.productId}-${item.options ?? ""}`}
              className="bg-surface border border-kraft rounded-2xl p-3 flex gap-3"
            >
              <button
                onClick={() => navigate(`/product/${item.slug}`)}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-cream shrink-0"
              >
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </button>
              <div className="grow min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => navigate(`/product/${item.slug}`)}
                    className="text-right font-bold text-ink hover:text-clay transition-colors line-clamp-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.name}
                  </button>
                  <button
                    onClick={() => removeItem(item.productId, item.options ?? null)}
                    className="text-muted-foreground hover:text-destructive shrink-0 p-1"
                    aria-label="حذف"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
                {item.options && (
                  <p className="text-xs text-muted-foreground mt-0.5">{item.options}</p>
                )}
                <div className="flex items-end justify-between mt-auto pt-2">
                  <div className="inline-flex items-center bg-canvas border border-kraft rounded-full overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, item.options ?? null, item.quantity - 1)}
                      className="w-8 h-9 flex items-center justify-center hover:bg-cream text-ink"
                      aria-label="کمتر"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-ink text-sm">
                      {toFa(item.quantity)}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.options ?? null, item.quantity + 1)}
                      className="w-8 h-9 flex items-center justify-center hover:bg-cream text-ink"
                      aria-label="بیشتر"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-clay font-bold">{formatToman(item.unitPrice * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => {
              if (confirm("سبد خالی بشه؟")) clear();
            }}
            className="text-sm text-muted-foreground hover:text-destructive mt-2 inline-flex items-center gap-1.5"
          >
            <Trash2 size={14} /> خالی کردن سبد
          </button>
        </div>

        {/* summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 bg-surface border border-kraft rounded-2xl p-5">
            <h2 className="font-extrabold text-ink mb-4" style={{ fontFamily: "var(--font-display)" }}>
              خلاصه سفارش
            </h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-ink/80">
                <span>جمع کالاها</span>
                <span className="font-medium">{formatToman(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink/80">
                <span>هزینه ارسال ({shopConfig.shippingMethod})</span>
                <span className="font-medium">
                  {freeShip ? <span className="text-moss font-bold">رایگان</span> : formatToman(shipping)}
                </span>
              </div>
            </div>
            <StitchDivider className="my-4" />
            <div className="flex justify-between items-center mb-5">
              <span className="font-bold text-ink">مبلغ قابل پرداخت</span>
              <span className="text-clay text-xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>
                {formatToman(total)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-4 leading-6 bg-cream/60 rounded-xl p-3">
              توجه: پرداخت فقط کارت‌به‌کارت است. در مرحله‌ی بعد شماره کارت و محل آپلود رسید رو نشونت
              می‌دم. سفارش تا تأیید دستی رسید پردازش نمی‌شه.
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full inline-flex items-center justify-center gap-2 bg-clay text-white py-3.5 rounded-full font-bold hover:bg-clay/90 active:translate-y-0.5 transition-all"
            >
              ادامه و تسویه‌حساب
              <ArrowLeft size={17} />
            </button>
            <button
              onClick={() => navigate("/shop")}
              className="w-full mt-2 text-sm text-muted-foreground hover:text-clay py-2"
            >
              ادامه‌ی خرید
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
