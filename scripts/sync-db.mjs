/**
 * scripts/sync-db.mjs
 *
 * Runs on every Vercel build (and locally if you want) to:
 *   1. Resolve the database URL. The Supabase × Vercel one-click
 *      integration auto-sets POSTGRES_PRISMA_URL, so DATABASE_URL doesn't
 *      need to be added manually on Vercel.
 *   2. Push the Prisma schema (`prisma db push`) — idempotent; a no-op when
 *      the schema is unchanged.
 *   3. Seed the database IF it's empty (first deploy). On later deploys the
 *      existing data is left untouched.
 *
 * If no database URL is configured (e.g. a pure `next build` test run), it
 * skips gracefully so the build still succeeds.
 */
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

process.env.DATABASE_URL =
  process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || "";

const url = process.env.DATABASE_URL;

if (!url) {
  console.log("ℹ️  DATABASE_URL / POSTGRES_PRISMA_URL تنظیم نشده — از sync صرف‌نظر می‌شه.");
  process.exit(0);
}

console.log("▶ همگام‌سازی schema با دیتابیس (prisma db push)...");
try {
  execSync("npx prisma db push --accept-data-loss", {
    stdio: "inherit",
    env: process.env,
  });
} catch (e) {
  // اگه db push ناموفق بود (مثلاً دیتابیس هنوز وصل نیست)، build رو نشکن —
  // فقط هشدار بده. جداول ممکنه از قبل وجود داشته باشن یا بعداً ساخته بشن.
  console.warn("⚠️ prisma db push ناموفق بود (build ادامه پیدا می‌کنه):", e.message);
  process.exit(0);
}

// فقط در صورت خالی بودن، seed کن (اولین دیپلوی)
const prisma = new PrismaClient();
try {
  const count = await prisma.product.count();
  if (count === 0) {
    console.log("▶ دیتابیس خالیه — در حال seed کردن محصولات نمونه...");
    try {
      execSync("bun run prisma/seed.ts", { stdio: "inherit", env: process.env });
      console.log("✅ seed انجام شد.");
    } catch (e) {
      console.warn("⚠️ seed ناموفق بود (build ادامه پیدا می‌کنه):", e.message);
    }
  } else {
    console.log(`ℹ️  دیتابیس ${count} محصول داره — از seed صرف‌نظر شد.`);
  }
} catch (e) {
  console.warn("⚠️ بررسی تعداد محصولات ناموفق بود:", e.message);
} finally {
  await prisma.$disconnect();
}
