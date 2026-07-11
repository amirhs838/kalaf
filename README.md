# کلاف و کاغذ 🧶

فروشگاه اینترنتی کوچک و خانگی برای بافتنی‌های دست‌ساز (عروسک‌های آمیگورومی، کیف‌های بافتنی، شال/کلاه/دستکش). پرداخت به‌صورت **کارت‌به‌کارت با آپلود رسید** — بدون درگاه آنلاین.

ساخته‌شده با Next.js 16، TypeScript، Tailwind CSS 4، Prisma (libSQL) و طراحی راست‌به‌چپ فارسی.

---

## ✨ ویژگی‌ها

- **طراحی دست‌ساز و اصیل:** پالت رنگ کاغذ کرافت و کلاف کاموا (ایوری، زنگاری، رز خاکی، سبز خزه‌ای)، فونت‌های فارسی Samim + Vazirmatn، کارت‌محصول به‌سبک «برچسب قیمت آویزون» با سوراخ نخ و چرخش عمدی، جداکننده‌های خط‌چین دوخت.
- **فروشگاه کامل:** صفحه اصلی نامتقارن، فروشگاه با فیلتر (دسته/رنگ/قیمت/موجودی/تک‌نسخه)، صفحه محصول با گالری زوم و نظرات، سبد خرید.
- **تسویه‌حساب کارت‌به‌کارت:** ثبت آدرس → نمایش شماره کارت با دکمه کپی → آپلود رسید (drag & drop) → تأیید با کد پیگیری.
- **پیگیری سفارش:** با کد + شماره موبایل، تایم‌لاین وضعیت با رنگ‌های پالت.
- **پنل مدیریت:** لاگین، لیست سفارش‌ها با فیلتر وضعیت، دیدن رسید، تأیید/رد پرداخت، یادداشت فروشنده، مدیریت موجودی و قیمت.
- **ریسپانسیو موبایل‌اول** و کاملاً RTL.

---

## 🚀 اجرای محلی

### ۱) نصب وابستگی‌ها

```bash
bun install
```

### ۲) تنظیم متغیرهای محیطی

```bash
cp .env.example .env
```

فایل `.env` را باز کنید و مقادیر را پر کنید (حداقل `DATABASE_URL`).

**برای dev محلی ساده** می‌توانید از یک فایل لوکال استفاده کنید (پیش‌فرض `.env.example`):

```
DATABASE_URL=file:./db/app.db
DATABASE_AUTH_TOKEN=
```

> ⚠️ توجه: اگر از مسیر نسبی `file:./db/app.db` استفاده می‌کنید، Prisma CLI فایل را در `prisma/db/` می‌سازد ولی اپلیکیشن آن را از `db/` می‌خواند. برای جلوگیری از این مشکل، از **مسیر مطلق** استفاده کنید:
> ```
> DATABASE_URL=file:/absolute/path/to/project/db/app.db
> ```

### ۳) راه‌اندازی دیتابیس و seed

```bash
bun run db:push      # ساخت جداول
bun run seed         # افزودن محصولات و نظرات نمونه
```

### ۴) اجرای سرور توسعه

```bash
bun run dev
```

سپس به `http://localhost:3000` بروید.

**ورود به پنل مدیریت:** روی آیکون قفل در هدر کلیک کنید. نام کاربری و رمز پیش‌فرض در `.env` (`SHOP_ADMIN_USER` و `SHOP_ADMIN_PASS`).

---

## ☁️ دیپلوی روی Vercel (با Supabase)

این پروژه از **Supabase JS client** استفاده می‌کنه. مراحل:

### مرحله ۱ — ساخت پروژه‌ی Supabase

1. به [supabase.com](https://supabase.com) برید و یه پروژه‌ی رایگان بسازید.
2. صبر کنین پروژه آماده بشه.

### مرحله ۲ — ساختن جداول (یک‌بار)

1. در Supabase Dashboard → **SQL Editor** → **New query**.
2. کل محتوای فایل [`supabase/schema.sql`](./supabase/schema.sql) رو کپی و Paste کنید.
3. **Run** بزنید. جداول ساخته می‌شن. (این کار فقط یک‌بار لازمه.)

### مرحله ۳ — ایمپورت در Vercel

1. مخزن GitHub رو در [vercel.com/new](https://vercel.com/new) ایمپورت کنید.
2. در تب **Settings → Environment Variables** این متغیرها رو اضافه کنید:

| نام | مقدار |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` (از Supabase → Settings → API) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | کلید publishable (همون‌جا) |
| `SHOP_BANK_CARD` | شماره کارت واقعی |
| `SHOP_BANK_OWNER` | نام صاحب حساب |
| `SHOP_WHATSAPP` | `989123456789` |
| `SHOP_INSTAGRAM` | آیدی اینستاگرام |
| `SHOP_PHONE` | `989123456789` |
| `SHOP_ADMIN_USER` / `SHOP_ADMIN_PASS` | نام کاربری و رمز قوی پنل |
| … | (بقیه در `.env.example`) |

> 💡 اگه از دکمه‌ی **Connect Supabase** توی Vercel → Storage استفاده کنین، خودش دو متغیر اول رو ست می‌کنه.

3. **Deploy**. در زمان build، `bun run scripts/seed.ts` خودکار محصولات نمونه رو اضافه می‌کنه (اگه دیتابیس خالی باشه).

> **نکته:** رسید پرداخت به‌صورت base64 در دیتابیس ذخیره می‌شه (نه فایل) چون filesystem ورسل موقته. حداکثر ۲ مگابایت.

---

## 💻 اجرای محلی

1. در `.env` این متغیرها رو از پروژه‌ی Supabase‌تون پر کنید:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
   ```
2. جداول رو بسازید: محتوای `supabase/schema.sql` رو در Supabase SQL Editor اجرا کنید.
3. محصولات نمونه: `bun run seed`
4. `bun run dev`

---

## 🛠 اسکریپت‌ها

| دستور | کار |
|---|---|
| `bun run dev` | سرور توسعه روی پورت ۳۰۰۰ |
| `bun run build` | build تولیدی + seed خودکار |
| `bun run lint` | بررسی ESLint |
| `bun run seed` | افزودن محصولات و نظرات نمونه (idempotent) |

---

## 📁 ساختار پروژه

```
prisma/
  schema.prisma        # مدل‌های دیتابیس (Product, Order, Review, ...)
  seed.ts              # داده‌های نمونه
src/
  app/
    api/               # API routes (products, orders, receipt, admin, reviews)
    page.tsx           # نقطه‌ی ورود (hash router روی مسیر /)
    layout.tsx         # RTL، فونت‌های فارسی
    globals.css        # پالت کاغذ/کلاف و کارت برچسب آویزون
  components/
    site/              # هدر، فوتر، کارت محصول، لوگو
    views/             # صفحه‌ها (home, shop, product, cart, checkout, ...)
    ui/                # shadcn/ui
  lib/
    db.ts              # Prisma Client با adapter libSQL
    config.ts          # خواندن مقادیر از env (با placeholder امن)
    types.ts           # تایپ‌های مشترک
    router.tsx         # hash-based router
    store.ts           # Zustand cart
    auth.ts            # احراز هویت پنل مدیریت
public/
  images/              # عکس‌های محصولات و صحنه
```

---

## 🎨 تصمیمات طراحی

- **پالت:** ایوری گرم `#FBF2E4` (نه سفید)، جوهر اسپرسویی `#3E2C23`، CTA زنگاری `#C2703D`. هیچ بنفش/آبیِ رایج قالب‌های AI نیست.
- **فونت:** Samim (تیتر، وزن ۸۰۰) + Vazirmatn (متن، وزن ۴۰۰) — کنتراست شدید.
- **کارت محصول:** برچسب آویزون با سوراخ نخ، نخ خط‌چین، چرخش ±۳° متناوب، گوشه‌های نامتقارن.
- **جداکننده‌ها:** خط‌چین «دوخت خیاطی».
- **وضعیت سفارش:** عسلی=درانتظار، سبز خزه‌ای=تأییدشده، زنگاری=آماده‌سازی، سرمه‌ای=ارسال‌شده.

---

ساخته‌شده با دست و عشق. 🧶
