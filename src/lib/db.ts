import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function resolveUrl(): string | undefined {
  // Supabase × Vercel one-click integration auto-sets POSTGRES_PRISMA_URL.
  // Local dev uses DATABASE_URL in .env. Prefer DATABASE_URL when present.
  return process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || undefined;
}

function createPrisma(): PrismaClient {
  const url = resolveUrl();
  if (!url) {
    throw new Error(
      "DATABASE_URL (یا POSTGRES_PRISCA_URL برای Supabase) تنظیم نشده است."
    );
  }
  // Set DATABASE_URL so Prisma's internal engine picks up the resolved URL
  // (it reads env("DATABASE_URL") from the schema at runtime).
  process.env.DATABASE_URL = url;
  return new PrismaClient();
}

/**
 * Lazy Prisma client.
 *
 * Why lazy? Next.js evaluates route modules at build time during
 * "Collecting page data". On Vercel, environment variables may not all be
 * available at that build moment. We defer construction to the first actual
 * query at request time, when env + runtime are guaranteed.
 *
 * `db` behaves exactly like a `PrismaClient` thanks to the Proxy — every
 * property access forwards to the lazily-created real instance.
 */
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = globalForPrisma.prisma ?? createPrisma();
    if (!globalForPrisma.prisma && process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
    }
    const value = (client as never)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
}) as PrismaClient;
