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

## ☁️ دیپلوی روی Vercel

این پروژه برای Vercel آماده شده. دو نکته‌ی مهم برای serverless:

1. **دیتابیس:** فایل SQLite لوکال روی Vercel دوام ندارد (filesystem موقت است). باید از **Turso** (libSQL سازگار با SQLite، رایگان) استفاده کنید.
2. **رسید پرداخت:** به‌جای فایل، به‌صورت base64 در دیتابیس ذخیره می‌شود (حداکثر ۲ مگابایت).

> ⚠️ **مهم:** حتماً همه‌ی متغیرهای محیطی (مخصوصاً `DATABASE_URL` و `DATABASE_AUTH_TOKEN`) را **قبل از اولین دیپلوی** در تنظیمات پروژه‌ی Vercel اضافه کنید. بدون این مقادیر، build یا runtime خطا می‌دهد.

### مراحل دیپلوی

#### مرحله ۱ — ساخت دیتابیس Turso (رایگان)

اگر Turso CLI نصب نیست:

```bash
curl -sSfL https://get.tur.so/install.sh | bash
turso auth login
```

ساخت دیتابیس و گرفتن اعتبار:

```bash
turso db create kalaf-kaghaz
turso db show kalaf-kaghaz --url      # → libsql://kalaf-kaghaz-<user>.turso.io
turso db tokens create kalaf-kaghaz   # → <long token>
```

اعتبار (schema) را push کنید:

```bash
# موقتاً DATABASE_URL و DATABASE_AUTH_TOKEN تورسو را در .env یا export کنید
export DATABASE_URL="libsql://kalaf-kaghaz-<user>.turso.io"
export DATABASE_AUTH_TOKEN="<token>"
bun run db:push
bun run seed
```

#### مرحله ۲ — ایمپورت پروژه در Vercel

1. مخزن GitHub را در [vercel.com/new](https://vercel.com/new) ایمپورت کنید.
2. Framework Preset: **Next.js** (خودکار تشخیص داده می‌شود).
3. متغیرهای محیطی را در تنظیمات پروژه اضافه کنید:

| نام | مقدار |
|---|---|
| `DATABASE_URL` | `libsql://kalaf-kaghaz-<user>.turso.io` |
| `DATABASE_AUTH_TOKEN` | توکن Turso |
| `SHOP_BANK_CARD` | شماره کارت واقعی |
| `SHOP_BANK_SHABA` | شماره شبا |
| `SHOP_BANK_OWNER` | نام صاحب حساب |
| `SHOP_BANK_NAME` | نام بانک |
| `SHOP_WHATSAPP` | `989123456789` |
| `SHOP_TELEGRAM` | آیدی تلگرام |
| `SHOP_INSTAGRAM` | آیدی اینستاگرام |
| `SHOP_PHONE` | `989123456789` |
| `SHOP_EMAIL` | ایمیل تماس |
| `SHOP_SHIPPING_COST` | `65000` |
| `SHOP_SHIPPING_METHOD` | `پست پیشتاز` |
| `SHOP_SHIPPING_DAYS` | `۲ تا ۵ روز کاری` |
| `SHOP_FREE_SHIPPING_THRESHOLD` | `1500000` |
| `SHOP_RETURN_POLICY` | متن سیاست بازگشت |
| `SHOP_ADMIN_USER` | نام کاربری پنل |
| `SHOP_ADMIN_PASS` | رمز قوی پنل |
| `SHOP_REVIEW_HOURS` | `2` |

4. **Deploy.**

پس از دیپلوی، Vercel به‌صورت خودکار `prisma generate` را (از طریق `postinstall`) اجرا می‌کند.

---

## 🛠 اسکریپت‌ها

| دستور | کار |
|---|---|
| `bun run dev` | سرور توسعه روی پورت ۳۰۰۰ |
| `bun run build` | build تولیدی |
| `bun run lint` | بررسی ESLint |
| `bun run db:push` | همگام‌سازی schema با دیتابیس |
| `bun run db:generate` | تولید Prisma Client |
| `bun run seed` | افزودن محصولات و نظرات نمونه |

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
