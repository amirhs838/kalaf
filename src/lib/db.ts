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

export const db = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
