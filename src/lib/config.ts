/**
 * پیکربندی فروشگاه «کلاف و کاغذ»
 *
 * همه‌ی مقادیر واقعی (شماره کارت، شبکه‌های اجتماعی، ...) از متغیرهای محیطی
 * خوانده می‌شن. اگه مقداری تنظیم نشده باشه، یک placeholder کاملاً غیرواقعی
 * و مشخص استفاده می‌شه تا هیچ‌وقت به‌اشتباه با داده‌ی جعلی منتشر نشه.
 *
 * برای فعال‌سازی واقعی، فایل .env رو با مقادیر واقعی‌تون پر کنید.
 */

function placeholder(label: string): string {
  // a clearly-fake placeholder so it can never be mistaken for real data
  return `«${label} — در .env تنظیم کنید»`;
}

export const shopConfig = {
  /** اطلاعات واریز کارت‌به‌کارت */
  bankCard: process.env.SHOP_BANK_CARD ?? "XXXX-XXXX-XXXX-XXXX",
  bankShaba: process.env.SHOP_BANK_SHABA ?? "IRXX-XXXX-XXXX-XXXX-XXXX-XXXX",
  bankOwner: process.env.SHOP_BANK_OWNER ?? placeholder("نام صاحب حساب"),
  bankName: process.env.SHOP_BANK_NAME ?? placeholder("نام بانک"),

  /** راه‌های ارتباطی پیش از خرید */
  whatsapp: process.env.SHOP_WHATSAPP ?? "98XXXXXXXXXXX",
  telegram: process.env.SHOP_TELEGRAM ?? placeholder("آیدی تلگرام"),
  instagram: process.env.SHOP_INSTAGRAM ?? "kolaf_va_kaghaz",
  contactPhone: process.env.SHOP_PHONE ?? "98XXXXXXXXXXX",
  contactEmail: process.env.SHOP_EMAIL ?? "shop@example.com",

  /** ارسال */
  shippingBaseCost: Number(process.env.SHOP_SHIPPING_COST ?? "65000"),
  shippingMethod: process.env.SHOP_SHIPPING_METHOD ?? "پست پیشتاز",
  shippingDays: process.env.SHOP_SHIPPING_DAYS ?? "۲ تا ۵ روز کاری",
  freeShippingThreshold: Number(process.env.SHOP_FREE_SHIPPING_THRESHOLD ?? "1500000"),

  /** سیاست بازگشت کالا */
  returnPolicy:
    process.env.SHOP_RETURN_POLICY ??
    "چون محصولات دست‌سازن، تعویض فقط در صورت نقص یا اشتباه در ارسال امکان‌پذیره. لطفاً قبل از سفارش، ابعاد و رنگ رو با دقت چک کنید و اگه سوالی دارید از طریق واتساپ بپرسید.",

  /** پنل مدیریت */
  adminUsername: process.env.SHOP_ADMIN_USER ?? "kolaf",
  adminPassword: process.env.SHOP_ADMIN_PASS ?? "kaghaz-1403",

  /** زمان بررسی رسید */
  reviewWindowHours: Number(process.env.SHOP_REVIEW_HOURS ?? "2"),

  /** نام و شعار برند */
  brandName: "کلاف و کاغذ",
  brandTagline: "بافتنی‌های دست‌ساز، یکی‌یکی با دست",
} as const;

export type ShopConfig = typeof shopConfig;
