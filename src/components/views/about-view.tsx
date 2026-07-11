"use client";

import { useRouter } from "@/lib/router";
import { shopConfig } from "@/lib/config";
import { StitchDivider } from "@/components/site/stitch-divider";
import { YarnBall } from "@/components/site/logo";
import { ArrowLeft, Home, ArrowRight, Heart, Scissors, Leaf, Sparkles, Truck, RefreshCcw } from "lucide-react";

export function AboutView() {
  const { navigate } = useRouter();

  return (
    <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
        <button onClick={() => navigate("/")} className="inline-flex items-center gap-1 hover:text-clay">
          <Home size={13} /> خانه
        </button>
        <ArrowRight size={13} className="rotate-180" />
        <span className="text-ink font-bold">داستان ما</span>
      </nav>

      {/* hero */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-14">
        <div className="md:col-span-7">
          <span className="inline-flex items-center gap-2 bg-cream border border-kraft text-ink/80 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            <Sparkles size={14} className="text-honey" /> از یک قلاب، تا یک فروشگاه
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink leading-tight mb-4" style={{ fontFamily: "var(--font-display)" }}>
            سلام، من اینجا رو برای بافتنی‌هام ساختم.
          </h1>
          <p className="text-ink/75 leading-8 mb-4">
            «کلاف و کاغذ» یک فروشگاه کوچک و خانگی‌ست. همه‌چیز از یه قلاب و چند کلاف نخ شروع شد — اول
            برای خودم، بعد برای دوستام، و حالا برای شما. هر عروسک، هر کیف و هر شال رو خودم، ردیف‌به‌ردیف،
            با دست می‌بافم؛ وسط چای و موسیقی و یه گربه‌ی کنجکاو.
          </p>
          <p className="text-ink/75 leading-8">
            به‌خاطر همین، خیلی از محصولات تک‌نسخه‌ان یا تیراژ محدود دارن. هیچ‌کدوم دقیقاً شبیه هم نیستن —
            و دقیقاً همین بخشش قشنگیه. اگه چیزی رو دوست داشتی ولی رنگش رو نه، می‌تونی سفارش بدی تا برات
            از نو بافته بشه.
          </p>
        </div>
        <div className="md:col-span-5">
          <div
            className="relative aspect-[4/5] rounded-[24px_32px_22px_28px] overflow-hidden border border-kraft shadow-lg"
            style={{ transform: "rotate(1.8deg)" }}
          >
            <img src="/images/scene-yarn-basket.jpg" alt="سبد کلاف‌های رنگی" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <StitchDivider withButton className="mb-12" />

      {/* values */}
      <section className="mb-14">
        <h2 className="text-2xl font-extrabold text-ink mb-6 text-center" style={{ fontFamily: "var(--font-display)" }}>
          چی کار می‌کنم و چطور؟
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Heart, color: "#D98C82", t: "دست‌ساز واقعی", d: "هر قطعه با دست و قلاب بافته می‌شه، نه ماشین." },
            { icon: Scissors, color: "#C2703D", t: "متریال خوب", d: "نخ‌های پنبه‌ای و پشمی نرم، ضدحساسیت." },
            { icon: Leaf, color: "#8CA37A", t: "تک‌نسخه و کم‌تیراژ", d: "خیلی‌ها فقط یکی هستن؛ هرچه زودتر خرید کنید." },
            { icon: Sparkles, color: "#DDA53B", t: "سفارشی‌سازی", d: "رنگ و طرح دلخواهت رو برات می‌بافم." },
          ].map((v) => (
            <div
              key={v.t}
              className="bg-surface border border-kraft rounded-2xl p-5 text-center"
              style={{ transform: `rotate(${Math.random() > 0.5 ? 0.5 : -0.5}deg)` }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: v.color + "22" }}>
                <v.icon size={22} style={{ color: v.color }} />
              </div>
              <h3 className="font-bold text-ink mb-1.5" style={{ fontFamily: "var(--font-display)" }}>{v.t}</h3>
              <p className="text-xs text-muted-foreground leading-6">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* process */}
      <section className="bg-cream/60 border border-kraft rounded-3xl p-7 sm:p-10 mb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div
            className="relative aspect-square rounded-3xl overflow-hidden border border-kraft"
            style={{ transform: "rotate(-1.5deg)" }}
          >
            <img src="/images/scene-workspace.jpg" alt="میز کار" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-ink mb-4" style={{ fontFamily: "var(--font-display)" }}>
              مسیر هر سفارش
            </h2>
            <ol className="space-y-4">
              {[
                { t: "انتخاب و سفارش", d: "محصول رو انتخاب می‌کنی و اطلاعات ارسال رو می‌دی." },
                { t: "پرداخت کارت‌به‌کارت", d: "واریز و آپلود رسید، ارسال طبق مراحل." },
                { t: "تأیید دستی رسید", d: "رسیدت رو بررسی می‌کنم (معمولاً کمتر از ۲ ساعت)." },
                { t: "بافت/آماده‌سازی", d: "اگه سفارشی باشه، از نو برات می‌بافمش." },
                { t: "بسته‌بندی و ارسال", d: "تو کاغذ کرافت با برچسب دست‌نویس بسته‌بندی و ارسال می‌شه." },
              ].map((s, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-clay text-white font-bold flex items-center justify-center shrink-0 text-sm">
                    {String(i + 1).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d])}
                  </div>
                  <div>
                    <p className="font-bold text-ink" style={{ fontFamily: "var(--font-display)" }}>{s.t}</p>
                    <p className="text-sm text-ink/70 leading-7">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* shipping + returns */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
        <div className="bg-surface border border-kraft rounded-2xl p-5">
          <h3 className="font-bold text-ink mb-2 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
            <Truck size={17} className="text-moss" /> ارسال
          </h3>
          <p className="text-sm text-ink/70 leading-7">
            ارسال به سراسر ایران از طریق {shopConfig.shippingMethod}. زمان تحویل تقریبی {shopConfig.shippingDays}.
            برای خریدهای بالای {new Intl.NumberFormat("fa-IR").format(shopConfig.freeShippingThreshold)} تومان،
            ارسال رایگانه.
          </p>
        </div>
        <div className="bg-surface border border-kraft rounded-2xl p-5">
          <h3 className="font-bold text-ink mb-2 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
            <RefreshCcw size={17} className="text-clay" /> بازگشت و تعویض
          </h3>
          <p className="text-sm text-ink/70 leading-7">{shopConfig.returnPolicy}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-ink text-canvas rounded-3xl p-10 relative overflow-hidden">
        <div className="absolute -top-8 -inset-inline-start-8 opacity-20">
          <YarnBall size={120} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 relative" style={{ fontFamily: "var(--font-display)" }}>
          بیا چیزی گرم و دست‌ساز داشته باش
        </h2>
        <p className="text-canvas/80 mb-6 relative">منتظر انتخابِ توام.</p>
        <button
          onClick={() => navigate("/shop")}
          className="inline-flex items-center gap-2 bg-clay text-white px-7 py-3 rounded-full font-bold hover:bg-clay/90 active:translate-y-0.5 transition-all relative"
        >
          دیدن محصولات
          <ArrowLeft size={17} />
        </button>
      </section>
    </div>
  );
}
