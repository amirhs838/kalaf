import { db } from "./db";
import { shopConfig } from "./config";

export const ADMIN_COOKIE = "kk_admin_token";

/** ساخت توکن رندم */
export function randomToken(len = 40): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  const buf = new Uint8Array(len);
  crypto.getRandomValues(buf);
  for (let i = 0; i < len; i++) out += chars[buf[i] % chars.length];
  return out;
}

function parseCookies(cookieHeader: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!cookieHeader) return out;
  for (const part of cookieHeader.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k) out[k] = decodeURIComponent(rest.join("="));
  }
  return out;
}

/** بررسی اعتبار توکن ادمین */
export async function getAdminToken(req: Request): Promise<string | null> {
  const cookies = parseCookies(req.headers.get("cookie"));
  const token = cookies[ADMIN_COOKIE];
  if (!token) return null;
  const session = await db.adminSession.findUnique({ where: { token } });
  if (!session) return null;
  // expiry: 7 days
  const ageMs = Date.now() - session.createdAt.getTime();
  if (ageMs > 7 * 24 * 60 * 60 * 1000) {
    await db.adminSession.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return token;
}

/** لاگین ادمین — مقایسه با مقادیر کانفیگ */
export function verifyAdminCredentials(username: string, password: string): boolean {
  return (
    username === shopConfig.adminUsername && password === shopConfig.adminPassword
  );
}

export function setAdminCookie(token: string): string {
  return `${ADMIN_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`;
}

export function clearAdminCookie(): string {
  return `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
