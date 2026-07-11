import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrisma(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const authToken = process.env.DATABASE_AUTH_TOKEN || undefined;
  // PrismaLibSQL accepts both `file:` (local dev) and `libsql:`/`https:` (Turso) URLs.
  const adapter = new PrismaLibSQL({ url, authToken });
  return new PrismaClient({ adapter });
}

/**
 * Lazy Prisma client.
 *
 * Why lazy? Next.js evaluates route modules at build time during
 * "Collecting page data". On Vercel, environment variables are not
 * necessarily available at that build moment (and for `file:` URLs the
 * filesystem doesn't exist either). We defer construction to the first
 * actual query at request time, when env + runtime are guaranteed.
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
