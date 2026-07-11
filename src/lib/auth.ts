import { supabase } from "./db";
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

interface AdminSessionRow {
  id: string;
  token: string;
  created_at: string;
}

/** بررسی اعتبار توکن ادمین */
export async function getAdminToken(req: Request): Promise<string | null> {
  const cookies = parseCookies(req.headers.get("cookie"));
  const token = cookies[ADMIN_COOKIE];
  if (!token) return null;
  const { data } = await supabase
    .from("admin_sessions")
    .select("*")
    .eq("token", token)
    .maybeSingle();
  const session = data as AdminSessionRow | null;
  if (!session) return null;
  // expiry: 7 days
  const ageMs = Date.now() - new Date(session.created_at).getTime();
  if (ageMs > 7 * 24 * 60 * 60 * 1000) {
    await supabase.from("admin_sessions").delete().eq("token", token);
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
