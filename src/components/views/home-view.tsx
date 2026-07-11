"use client";

import { useRouter } from "@/lib/router";
import { useApi } from "@/lib/use-api";
import { formatToman, toFa } from "@/lib/format";
import { CATEGORY_LABELS, type Category, type Product } from "@/lib/types";
import { ProductCard } from "@/components/site/product-card";
import { StitchDivider } from "@/components/site/stitch-divider";
import { YarnBall } from "@/components/site/logo";
import { ArrowLeft, Sparkles, Heart, ShoppingBag, CreditCard, Upload, CheckCircle2, AlertCircle } from "lucide-react";

/** NOTICE shown when the database isn't configured (e.g. local dev without a Supabase URL). */
function DbNotice() {
  return (
    <div className="col-span-full flex items-start gap-3 bg-cream/70 border border-honey/50 rounded-2xl p-4 text-sm">
      <AlertCircle size={18} className="text-honey shrink-0 mt-0.5" />
      <div className="text-ink/80 leading-7">
        <p className="font-bold text-ink mb-1">دیتابیس وصل نیست</p>
        محصولات الان نمایش داده نمی‌شن. برای اجرای محلی، connection string پروژه‌ی Supabase
        (یا هر PostgreSQL) رو در فایل <code className="bg-surface px-1.5 py-0.5 rounded text-xs">.env</code> به‌عنوان{" "}
        <code className="bg-surface px-1.5 py-0.5 rounded text-xs" dir="ltr">DATABASE_URL</code> بذارید، بعد{" "}
        <code className="bg-surface px-1.5 py-0.5 rounded text-xs" dir="ltr">bun run db:push &amp;&amp; bun run seed</code>{" "}
        رو اجرا کنید. روی Vercel، اتصال Supabase خودکار این رو حل می‌کنه.
      </div>
    </div>
  );
}

function SectionTitle({
  kicker,
  title,
  desc,
  action,
}: {
  kicker?: string;
  title: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        {kicker && (
          <span className="inline-block text-xs font-bold text-clay mb-2 tracking-wide">
            {kicker}
          </span>
        )}
        <h2
          className="text-2xl sm:text-3xl font-extrabold text-ink"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
        {desc && <p className="text-sm text-muted-foreground mt-2 max-w-xl leading-7">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

const CATEGORY_CARDS: { cat: Category; title: string; img: string; blurb: string; size: "lg" | "sm" }[] = [
  {
    cat: "doll",
    title: CATEGORY_LABELS.doll,
    img: "/images/doll-bunny.jpg",
    blurb: "عروسک‌های آمیگورومی، تک‌نسخه و پرشخصیت",
    size: "lg",
  },
  {
    cat: "bag",
    title: CATEGORY_LABELS.bag,
    img: "/images/bag-tote.jpg",
    blurb: "کیف‌های بافتنی و دست‌دوز",
    size: "sm",
  },
  {
    cat: "knitwear",
    title: CATEGORY_LABELS.knitwear,
    img: "/images/knit-shawl.jpg",
    blurb: "شال، کلاه، دستکش و رومیزی",
    size: "sm",
  },
];

const GALLERY = [
  { img: "/images/doll-cat.jpg", name: "مینا" },
  { img: "/images/knit-beanie.jpg", name: "رها" },
  { img: "/images/scene-packaging.jpg", name: "بسته‌بندی" },
  { img: "/images/bag-crossbody.jpg", name: "سینا" },
  { img: "/images/knit-mittens.jpg", name: "نیلوفر" },
  { img: "/images/doll-mushroom.jpg", name: "آوا" },
];

export function HomeView() {
  const { navigate } = useRouter();
  const fresh = useApi<{ products: Product[] }>("/api/products?new=true&limit=8");
  const featured = useApi<{ products: Product[] }>("/api/products?featured=true&limit=4");

  const freshProducts = fresh.data?.products ?? [];
  const featuredProducts = featured.data?.products ?? [];
  const spotlight = featuredProducts[0];
  const sideFeatured = featuredProducts.slice(1, 4);

  return (
    <div className="flex flex-col">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* text */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <span className="inline-flex items-center gap-2 bg-cream border border-kraft text-ink/80 text-xs font-bold px-3 py-1.5 rounded-full mb-5">
                <Sparkles size={14} className="text-honey" />
                ساخته‌شده با دست، نه با ماشین
              </span>
              <h1
                className="text-[2.1rem] sm:text-5xl font-extrabold text-ink leading-[1.1] mb-5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                هر نخ، یک داستان.
                <br />
                هر بافت، یک{" "}
                <span className="relative inline-block text-clay">
                  قلب
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="8"
                    viewBox="0 0 100 8"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 5 Q 25 1, 50 5 T 98 5"
                      stroke="#C2703D"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                .
              </h1>
              <p className="text-ink/75 text-base sm:text-lg leading-8 mb-7 max-w-lg">
                عروسک‌های بافتنی، کیف‌های دست‌دوز و بافتنی‌های گرم — همه رو خودم، ردیف‌به‌ردیف، با
                دست می‌بافم. هیچ‌کدوم دقیقاً شبیه هم نیستن، و دقیقاً همین بخشش قشنگیه.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate("/shop")}
                  className="inline-flex items-center gap-2 bg-clay text-white px-6 py-3 rounded-full font-bold hover:bg-clay/90 active:translate-y-0.5 transition-all shadow-sm"
                >
                  <ShoppingBag size={18} />
                  دیدن محصولات
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className="inline-flex items-center gap-2 bg-surface border border-kraft text-ink px-6 py-3 rounded-full font-bold hover:bg-cream transition-colors"
                >
                  داستان ما
                  <ArrowLeft size={16} />
                </button>
              </div>
              {/* mini trust row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Heart size={14} className="text-rose" /> دست‌ساز و تک‌نسخه
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CreditCard size={14} className="text-clay" /> پرداخت کارت‌به‌کارت
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-moss" /> ارسال به سراسر ایران
                </span>
              </div>
            </div>

            {/* image */}
            <div className="lg:col-span-6 order-1 lg:order-2 relative">
              <div
                className="relative aspect-[4/5] sm:aspect-[5/5] lg:aspect-[4/5] rounded-[28px_38px_24px_36px] overflow-hidden border border-kraft shadow-xl"
                style={{ transform: "rotate(-1.8deg)" }}
              >
                <img
                  src="/images/hero-knitting.jpg"
                  alt="دست‌هایی در حال بافتن یک عروسک بافتنی"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent" />
              </div>
              {/* floating price-tag chip */}
              <div
                className="absolute -bottom-4 inset-inline-start-2 sm:start-6 bg-surface border border-kraft rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3"
                style={{ transform: "rotate(2.5deg)" }}
              >
                <YarnBall size={34} />
                <div className="leading-tight">
                  <p className="text-[0.65rem] text-muted-foreground">از</p>
                  <p className="text-clay font-extrabold" style={{ fontFamily: "var(--font-display)" }}>
                    {formatToman(95000)}
                  </p>
                </div>
              </div>
              {/* small floating skein */}
              <div
                className="hidden sm:block absolute -top-3 inset-inline-end-4 w-12 h-12 rounded-full bg-honey/90 shadow-md flex items-center justify-center text-white text-xs font-bold"
                style={{ transform: "rotate(12deg)" }}
              >
                دست‌دوز
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl w-full px-4 sm:px-6">
        <StitchDivider withButton />
      </div>

      {/* ============ CATEGORIES (bento, asymmetric) ============ */}
      <section className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-12">
        <SectionTitle
          kicker="دسته‌بندی"
          title="سه دنیای کوچک"
          desc="هر دسته قصه‌ی خودش رو داره. برو ببینی کدوم به قلبت نزدیک‌تره."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {CATEGORY_CARDS.map((c, i) => (
            <button
              key={c.cat}
              onClick={() => navigate(`/category/${c.cat}`)}
              className={`group relative overflow-hidden rounded-3xl border border-kraft bg-surface text-right ${
                c.size === "lg" ? "md:row-span-2 md:col-span-1" : ""
              }`}
              style={{ transform: `rotate(${i % 2 === 0 ? -0.6 : 0.7}deg)` }}
            >
              <div className={`relative ${c.size === "lg" ? "aspect-[3/4] md:aspect-[3/4.2]" : "aspect-[4/3]"}`}>
                <img
                  src={c.img}
                  alt={c.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              </div>
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <h3
                  className="text-xl font-extrabold mb-1"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {c.title}
                </h3>
                <p className="text-sm text-white/85">{c.blurb}</p>
                <span className="inline-flex items-center gap-1.5 mt-3 text-sm font-bold text-honey">
                  دیدن
                  <ArrowLeft size={15} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ============ NEW ARRIVALS ============ */}
      <section className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-12">
        <SectionTitle
          kicker="تازه‌ها"
          title="تازه از زیر قلاب"
          desc="آخرین چیزهایی که بافتم. خیلی‌هاشون تک‌نسخه‌ان، پس زودتر بهتر."
          action={
            <button
              onClick={() => navigate("/shop")}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-clay hover:gap-2.5 transition-all"
            >
              همه را ببین
              <ArrowLeft size={16} />
            </button>
          }
        />
        {fresh.loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-cream animate-pulse" />
            ))}
          </div>
        ) : fresh.error || freshProducts.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <DbNotice />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {freshProducts.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ============ FEATURED SPOTLIGHT (asymmetric) ============ */}
      {spotlight && (
        <section className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-12">
          <SectionTitle kicker="محبوب‌ترین‌ها" title="چیزهایی که دل‌ها رو بردن" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* big spotlight */}
            <button
              onClick={() => navigate(`/product/${spotlight.slug}`)}
              className="lg:col-span-7 group relative overflow-hidden rounded-[24px_30px_22px_28px] border border-kraft bg-surface text-right"
              style={{ transform: "rotate(-0.5deg)" }}
            >
              <div className="relative aspect-[16/11] sm:aspect-[16/9]">
                <img
                  src={spotlight.images[0]}
                  alt={spotlight.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                <span className="absolute top-4 inset-inline-end-4 bg-honey text-ink text-xs font-bold px-3 py-1 rounded-full">
                  محبوب
                </span>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                <h3 className="text-2xl font-extrabold mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  {spotlight.name}
                </h3>
                <p className="text-sm text-white/85 mb-3 line-clamp-1">{spotlight.description}</p>
                <span className="inline-flex items-center gap-2 text-honey font-bold">
                  {formatToman(spotlight.price)}
                  <ArrowLeft size={16} />
                </span>
              </div>
            </button>
            {/* side list */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {sideFeatured.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/product/${p.slug}`)}
                  className="group flex items-center gap-4 bg-surface border border-kraft rounded-2xl p-3 hover:bg-cream transition-colors text-right"
                  style={{ transform: `rotate(${i % 2 === 0 ? 0.4 : -0.5}deg)` }}
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-cream shrink-0">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="grow min-w-0">
                    <h4 className="font-bold text-ink truncate" style={{ fontFamily: "var(--font-display)" }}>
                      {p.name}
                    </h4>
                    <p className="text-clay font-bold text-sm mt-1">{formatToman(p.price)}</p>
                  </div>
                  <ArrowLeft size={16} className="text-muted-foreground group-hover:text-clay transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ STORY SNIPPET ============ */}
      <section className="bg-cream/60 border-y border-kraft">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5">
              <div
                className="relative aspect-[4/5] rounded-[22px_30px_20px_26px] overflow-hidden border border-kraft shadow-md"
                style={{ transform: "rotate(1.5deg)" }}
              >
                <img
                  src="/images/scene-workspace.jpg"
                  alt="میز کار بافنده"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-7">
              <span className="text-xs font-bold text-clay tracking-wide">داستان ما</span>
              <h2
                className="text-2xl sm:text-3xl font-extrabold text-ink mt-2 mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                از یک سبد کاموا، تا یک فروشگاه کوچک
              </h2>
              <p className="text-ink/75 leading-8 mb-4">
                همه‌چیز از یه قلاب و چند کلاف نخ شروع شد — اول برای خودم، بعد برای دوستام، و حالا برای
                شما. هر قطعه رو تو یه گوشه‌ی دنج خونه با دست می‌بافم، وسط چای و موسیقی و یه گربه‌ی
                کنجکاو.
              </p>
              <p className="text-ink/75 leading-8 mb-6">
                به‌خاطر همین، خیلی از محصولات تک‌نسخه‌ان یا تیراژ محدود دارن. اگه چیزی رو دوست داشتی
                ولی رنگش رو نه، می‌تونی سفارش بدی تا برات از نو بافته بشه.
              </p>
              <button
                onClick={() => navigate("/about")}
                className="inline-flex items-center gap-2 bg-ink text-canvas px-5 py-2.5 rounded-full font-bold hover:bg-ink/90 transition-colors"
              >
                ادامه‌ی داستان
                <ArrowLeft size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CUSTOMER GALLERY ============ */}
      <section className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-14">
        <SectionTitle
          kicker="گالری مشتریان"
          title="از دست‌های من، به خانه‌های شما"
          desc="عکس‌هایی که خریداران عزیز فرستادن. اینا واقعی‌ن، مثل بافتنی‌هاشون."
        />
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
          {GALLERY.map((g, i) => (
            <figure
              key={i}
              className="snap-start shrink-0 w-44 sm:w-52 rounded-2xl overflow-hidden bg-surface border border-kraft"
              style={{ transform: `rotate(${i % 2 === 0 ? -1.2 : 1.4}deg)` }}
            >
              <div className="aspect-square overflow-hidden bg-cream">
                <img src={g.img} alt={g.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <figcaption className="px-3 py-2 text-xs text-muted-foreground flex items-center gap-1.5">
                <Heart size={12} className="text-rose fill-rose" />
                {g.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ============ PAYMENT / TRUST BANNER ============ */}
      <section className="mx-auto max-w-6xl w-full px-4 sm:px-6 pb-16">
        <div className="relative bg-ink text-canvas rounded-[24px_30px_24px_30px] overflow-hidden p-7 sm:p-10">
          <div className="absolute -top-8 -inset-inline-end-8 w-40 h-40 rounded-full bg-clay/20 blur-2xl" />
          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7">
              <h2
                className="text-2xl sm:text-3xl font-extrabold mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                چطور خرید می‌کنیم؟ ساده و شفاف.
              </h2>
              <p className="text-canvas/80 leading-8 mb-6 max-w-lg">
                درگاه پرداخت آنلاین نداریم — چون یه کارگاه کوچیکم. در عوض، پرداخت کارت‌به‌کارت با آپلود
                رسید انجام می‌شه. سفارشت رو ثبت می‌کنم، رسیدت رو بررسی می‌کنم (معمولاً کمتر از{" "}
                {toFa(2)} ساعت در ساعات کاری) و بعد بافت/آماده‌سازی شروع می‌شه.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="inline-flex items-center gap-2 bg-clay text-white px-6 py-3 rounded-full font-bold hover:bg-clay/90 active:translate-y-0.5 transition-all"
              >
                <ShoppingBag size={18} />
                شروع خرید
              </button>
            </div>
            <div className="md:col-span-5 flex flex-col gap-3">
              {[
                { icon: ShoppingBag, t: "انتخاب و ثبت سفارش", d: "محصول رو به سبد اضافه کن و اطلاعات ارسال رو بده" },
                { icon: CreditCard, t: "واریز کارت‌به‌کارت", d: "شماره کارت رو کپی کن، واریز کن و رسید رو آپلود کن" },
                { icon: Upload, t: "آپلود رسید", d: "عکس رسید و کد پیگیری رو بفرست" },
                { icon: CheckCircle2, t: "تأیید و ارسال", d: "بعد از تأیید، بافت/آماده‌سازی و ارسال انجام می‌شه" },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3 bg-canvas/5 rounded-2xl p-3 border border-canvas/10">
                  <div className="w-9 h-9 rounded-full bg-clay flex items-center justify-center shrink-0">
                    <s.icon size={17} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ fontFamily: "var(--font-display)" }}>
                      {toFa(i + 1)}. {s.t}
                    </p>
                    <p className="text-xs text-canvas/70 mt-0.5">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
