import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

type SeedProduct = {
  slug: string;
  name: string;
  category: "doll" | "bag" | "knitwear";
  description: string;
  story: string;
  price: number;
  images: string[];
  stock: number;
  isUnique: boolean;
  isFeatured: boolean;
  isNew: boolean;
  colors: string[];
  materials: string;
  dimensions: string;
  prepDays: number;
  customizable: boolean;
};

const products: SeedProduct[] = [
  {
    slug: "amigurumi-bunny",
    name: "عروسک خرگوش بافتنی",
    category: "doll",
    description:
      "یک خرگوش کوچولوی بافتنی با گوش‌های بلند و پاپیون پشمی. بدن از نخ پنبه نرم بافته شده و توشنش الیاف ضدحساسیت هست. جای هیچ‌کدوم از این خرگوش‌ها شبیه دیگه‌ست؟ نه، چون همه‌شون رو یکی‌یکی با قلاب بافتم.",
    story:
      "این مدل اولین بار برای هدیه تولد خواهرزاده‌م بافته شد؛ از اون موقع یکی از محبوب‌ترین‌های فروشگاه شده.",
    price: 185000,
    images: ["/images/doll-bunny.jpg", "/images/scene-yarn-basket.jpg"],
    stock: 1,
    isUnique: true,
    isFeatured: false,
    isNew: true,
    colors: ["کرم", "قهوه‌ای روشن"],
    materials: "نخ پنبه ۱۰۰٪، الیاف ضدحساسیت، دکمه‌های ایمن چشمی",
    dimensions: "ارتفاع ۲۴ سانتی‌متر",
    prepDays: 4,
    customizable: true,
  },
  {
    slug: "amigurumi-bear",
    name: "عروسک خرسه عسل",
    category: "doll",
    description:
      "خرسه‌ی کوچولوی عسلی‌رنگ با یک شال‌گردن دست‌بافت. جنسش کاملاً نرم و لمسی و مناسب برای آغوش بچه‌ها. چشم‌ها گل‌دوزی شده تا هیچ قطعه‌ی جدا شونده‌ای نداشته باشه.",
    story: "الهام‌گرفته از خرسه‌ی پشمالویی که بچگی داشتم و هنوزم نگهش داشتم.",
    price: 165000,
    images: ["/images/doll-bear.jpg"],
    stock: 2,
    isUnique: false,
    isFeatured: true,
    isNew: false,
    colors: ["عسلی", "قهوه‌ای"],
    materials: "نخ اکریلیک پلاش، الیاف ضدحساسیت",
    dimensions: "ارتفاع ۲۰ سانتی‌متر",
    prepDays: 3,
    customizable: true,
  },
  {
    slug: "amigurumi-cat",
    name: "عروسک گربه بافتنی",
    category: "doll",
    description:
      "گربه‌ی بافتنی خاکستری با یک شال‌گردن صورتی خاکی. دمشه بلنده و می‌تونه تکون بخوره. رو صورتش ویبری‌س‌های سبکی گل‌دوزی شده.",
    story: "یه سفارش مخصوص بود که بعداً به محصول ثابت تبدیل شد.",
    price: 175000,
    images: ["/images/doll-cat.jpg"],
    stock: 2,
    isUnique: false,
    isFeatured: false,
    isNew: false,
    colors: ["خاکستری", "صورتی خاکی"],
    materials: "نخ پنبه و اکریلیک، الیاف ضدحساسیت",
    dimensions: "ارتفاع ۲۲ سانتی‌متر (با دم ۳۰)",
    prepDays: 4,
    customizable: true,
  },
  {
    slug: "amigurumi-mushroom",
    name: "عروسک قارچ کویی",
    category: "doll",
    description:
      "یه قارچ بامزه با کلاه قرمز و نقطه‌های سفید و پای کرمی. یه چهره‌ی کوچولو روش گل‌دوزی شده. عاشق گوشه‌ی میز یا طاقچه‌ست.",
    story: "ساختمش وقتی یه روز بارونی دلم گرفت قارچ بافتم — از اون روز ماندگار شد.",
    price: 145000,
    images: ["/images/doll-mushroom.jpg"],
    stock: 1,
    isUnique: true,
    isFeatured: false,
    isNew: true,
    colors: ["قرمز", "کرم"],
    materials: "نخ پنبه، الیاف ضدحساسیت",
    dimensions: "ارتفاع ۱۴ سانتی‌متر",
    prepDays: 3,
    customizable: false,
  },
  {
    slug: "tote-bag-clay",
    name: "کیف توت بافتنی زنگاری",
    category: "bag",
    description:
      "کیف توت بافتنی با دسته‌های چوبی، به رنگ زنگاری سوخته. داخلش پوشش پارچه‌ای داره و جیب کوچولو هم داره. برای خرید روزمره یا کیف کتاب عالیه.",
    story: "اولین کیفی بود که بافتمش و از اون موقع خیلی‌ها براش سفارش دادن.",
    price: 245000,
    images: ["/images/bag-tote.jpg"],
    stock: 3,
    isUnique: false,
    isFeatured: true,
    isNew: false,
    colors: ["زنگاری", "کرم"],
    materials: "نخ پنبه بافتنی، دسته چوبی، آستر پارچه‌ای",
    dimensions: "۳۵×۳۸ سانتی‌متر، دسته ۲۸ سانتی‌متر",
    prepDays: 5,
    customizable: true,
  },
  {
    slug: "crossbody-moss",
    name: "کیف کمری بافتنی سبز خزه‌ای",
    category: "bag",
    description:
      "کیف کمری بافتنی سبز خزه‌ای با بند چرمی قابل تنظیم. بسته‌بندی زیپ‌دار و آستر داخل. اندازش مناسبه برای گوشی، کلید و لوازم روزمره.",
    story: "رنگش از کلاف‌های سبز کم‌رنگ یه سبد قدیمی الهام گرفته شده.",
    price: 265000,
    images: ["/images/bag-crossbody.jpg"],
    stock: 1,
    isUnique: true,
    isFeatured: false,
    isNew: false,
    colors: ["سبز خزه‌ای"],
    materials: "نخ اکریلیک، بند چرمی، آستر",
    dimensions: "۲۰×۱۶ سانتی‌متر، بند قابل تنظیم تا ۱۲۰",
    prepDays: 5,
    customizable: true,
  },
  {
    slug: "bucket-bag-rose",
    name: "کیف سطل بافتنی رز خاکی",
    category: "bag",
    description:
      "کیف سطلی بافتنی به رنگ رز خاکی با بند کشویی. ظاهر نرم و لمسی داره و جاش بیشتر از چیزیه که فکر می‌کنید.",
    story: "یه تمرین بافت نعلبکی بود که کم‌کم تبدیل به کیف شد.",
    price: 225000,
    images: ["/images/bag-bucket.jpg"],
    stock: 2,
    isUnique: false,
    isFeatured: false,
    isNew: false,
    colors: ["رز خاکی"],
    materials: "نخ پنبه، بند کشویی پارچه‌ای",
    dimensions: "قطر ۱۸، ارتفاع ۲۲ سانتی‌متر",
    prepDays: 5,
    customizable: true,
  },
  {
    slug: "shawl-honey",
    name: " شال بافتنی عسلی",
    category: "knitwear",
    description:
      "شال بافتنی عسلیِ نرم و گرم، با الگوی رومیزی ظریف. به‌خاطر نخ مرینوس خیلی سبکه و گرماش هم درجه یک. برای سرما و عصرهای پاییزی عالیه.",
    story: "الگوش رو خودم از روی یه شال مادربزرگ کشیدم و بازسازیش کردم.",
    price: 295000,
    images: ["/images/knit-shawl.jpg"],
    stock: 3,
    isUnique: false,
    isFeatured: true,
    isNew: false,
    colors: ["عسلی", "خردلی"],
    materials: "نخ مرینوس ۵۰٪، اکریلیک ۵۰٪",
    dimensions: "۷۰×۱۶۰ سانتی‌متر",
    prepDays: 7,
    customizable: true,
  },
  {
    slug: "beanie-navy",
    name: "کلاه بافتنی سرمه‌ای",
    category: "knitwear",
    description:
      "کلاه بافتنی سرمه‌ای با پوم‌پوم کوچولو. بافته‌شده با نخ پشمی نرم که سرما رو عرق نکنه. اندازه‌ش آزاد و کشسان.",
    story: "اولین بار برای خودم بافتمش، بعد همه‌ی دوستام خواستن!",
    price: 95000,
    images: ["/images/knit-beanie.jpg"],
    stock: 4,
    isUnique: false,
    isFeatured: false,
    isNew: true,
    colors: ["سرمه‌ای"],
    materials: "نخ پشمی اکریلیک",
    dimensions: "اندازه آزاد (۵۴–۵۸)",
    prepDays: 2,
    customizable: true,
  },
  {
    slug: "mittens-moss",
    name: "دستکش بافتنی جفتی",
    category: "knitwear",
    description:
      "دستکش بافتنی سبز خزه‌ای، جفتی و گرم. مچ‌ش بلنده و سرما رو پس می‌زنه. روی هرکدوم یه گل‌دوزی کوچولو هست.",
    story: "برای هدیه زمستونی دوستام بافتمش.",
    price: 115000,
    images: ["/images/knit-mittens.jpg"],
    stock: 3,
    isUnique: false,
    isFeatured: false,
    isNew: false,
    colors: ["سبز خزه‌ای"],
    materials: "نخ پشمی اکریلیک",
    dimensions: "اندازه آزاد بزرگسال",
    prepDays: 3,
    customizable: true,
  },
  {
    slug: "table-runner-rose",
    name: "رومیزی میز بافتنی",
    category: "knitwear",
    description:
      "رومیزی بافتنی کرم با حاشیه‌ی صورتی خاکی، بافته‌شده با الگوی فانتزی. برای میز ایوان یا میز تزئینی عالیه. شست‌ونده با دست.",
    story: "الگوش مال یه مجله‌ی قدیمی بافتنی بود که بازسازیش کردم.",
    price: 195000,
    images: ["/images/knit-runner.jpg"],
    stock: 2,
    isUnique: false,
    isFeatured: false,
    isNew: false,
    colors: ["کرم", "صورتی خاکی"],
    materials: "نخ پنبه",
    dimensions: "۴۰×۱۲۰ سانتی‌متر",
    prepDays: 6,
    customizable: true,
  },
  {
    slug: "scarf-clay",
    name: "شال‌گردن بافتنی راه‌راه",
    category: "knitwear",
    description:
      "شال‌گردن بافتنی راه‌راه زنگاری و کرمی. بلنده و می‌تونید چند بار دور بذارید. سبکه ولی گرم.",
    story: "از نخ‌های باقی‌مونده‌ی پروژه‌های قبلی بافتمش — پس کاملاً پایداره!",
    price: 135000,
    images: ["/images/knit-scarf.jpg"],
    stock: 4,
    isUnique: false,
    isFeatured: false,
    isNew: false,
    colors: ["زنگاری", "کرم"],
    materials: "نخ پنبه و اکریلیک",
    dimensions: "۲۵×۱۸۰ سانتی‌متر",
    prepDays: 4,
    customizable: false,
  },
];

const reviews = [
  {
    productSlug: "amigurumi-bunny",
    customerName: "مریم",
    rating: 5,
    comment: "دقیقاً مثل عکس بود، حتی قشنگ‌تر! بافتش خیلی تمیز و نازه. دخترم عاشقش شد.",
    images: "[]",
  },
  {
    productSlug: "tote-bag-clay",
    customerName: "سارا",
    rating: 5,
    comment: "کیفیت نخ و بافت فوق‌العاده‌ست، خیلی مقاومه. رنگش هم دقیقاً همون زنگاریه که می‌خواستم.",
    images: "[]",
  },
  {
    productSlug: "shawl-honey",
    customerName: "نگار",
    rating: 4,
    comment: "شال خیلی نرم و گرمه. فقط یه کم دیرتر از موعد رسید، ولی ارزشش رو داشت.",
    images: "[]",
  },
  {
    productSlug: "amigurumi-bear",
    customerName: "احمد",
    rating: 5,
    comment: "برای هدیه تولد بچه‌گرفتم، مادر بچه خیلی خوشش اومد. ممنون از زحماتتون.",
    images: "[]",
  },
];

async function main() {
  console.log("🌱 در حال پاک‌سازی دیتابیس...");
  await db.review.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.product.deleteMany();
  await db.adminSession.deleteMany();

  console.log("📦 در حال افزودن محصولات...");
  for (const p of products) {
    await db.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        category: p.category,
        description: p.description,
        story: p.story,
        price: p.price,
        images: JSON.stringify(p.images),
        stock: p.stock,
        isUnique: p.isUnique,
        isFeatured: p.isFeatured,
        isNew: p.isNew,
        colors: JSON.stringify(p.colors),
        materials: p.materials,
        dimensions: p.dimensions,
        prepDays: p.prepDays,
        customizable: p.customizable,
      },
    });
  }

  console.log("💬 در حال افزودن نظرات...");
  for (const r of reviews) {
    const product = await db.product.findUnique({ where: { slug: r.productSlug } });
    if (!product) continue;
    await db.review.create({
      data: {
        productId: product.id,
        customerName: r.customerName,
        rating: r.rating,
        comment: r.comment,
        images: r.images,
        approved: true,
      },
    });
  }

  console.log("✅ seed تمام شد.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
