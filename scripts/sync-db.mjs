/**
 * scripts/sync-db.mjs
 *
 * Runs on every Vercel build (and locally if you want) to:
 *   1. Resolve the database URL. The Supabase × Vercel one-click
 *      integration auto-sets several POSTGRES_* vars.
 *   2. Push the Prisma schema (`prisma db push`) — idempotent; a no-op when
 *      the schema is unchanged. Uses the NON-POOLING (direct) URL because
 *      DDL operations can't run over Supabase's pooled transaction endpoint.
 *   3. Seed the database IF it's empty (first deploy). On later deploys the
 *      existing data is left untouched.
 *
 * If no database URL is configured (e.g. a pure `next build` test run), it
 * skips gracefully so the build still succeeds.
 */
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

// Vercel-Supabase integration sets both pooled and non-pooled URLs.
// - Pooled (POSTGRES_PRISMA_URL, port 6543): for runtime queries.
// - Non-pooled (POSTGRES_URL_NON_POOLING, port 5432): for DDL/migrations.
// Locally, DATABASE_URL in .env is used for everything.
const runtimeUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  "";
const directUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.POSTGRES_URL_NON_POOLING || // (dup intentional for clarity)
  process.env.POSTGRES_PRISMA_URL ||
  "";

if (!runtimeUrl) {
  console.log("ℹ️  DATABASE_URL / POSTGRES_PRISMA_URL تنظیم نشده — از sync صرف‌نظر می‌شه.");
  process.exit(0);
}

console.log("▶ همگام‌سازی schema با دیتابیس (prisma db push)...");
try {
  // Use the DIRECT (non-pooled) URL for DDL. Supabase's pooled endpoint
  // (port 6543) rejects DDL statements.
  execSync("npx prisma db push --accept-data-loss", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: directUrl },
  });
} catch (e) {
  console.warn("⚠️ prisma db push ناموفق بود (build ادامه پیدا می‌کنه):", e.message);
  process.exit(0);
}

// فقط در صورت خالی بودن، seed کن (اولین دیپلوی)
const prisma = new PrismaClient({
  datasources: { db: { url: runtimeUrl } },
});
try {
  const count = await prisma.product.count();
  if (count === 0) {
    console.log("▶ دیتابیس خالیه — در حال seed کردن محصولات نمونه...");
    try {
      execSync("bun run prisma/seed.ts", {
        stdio: "inherit",
        env: { ...process.env, DATABASE_URL: runtimeUrl },
      });
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
