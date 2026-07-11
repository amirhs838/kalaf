import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY تنظیم نشده‌اند."
    );
  }
  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

/**
 * Lazy Supabase client.
 *
 * Why lazy? Next.js evaluates route modules at build time during
 * "Collecting page data". The env vars may not be set then, so we defer
 * construction to the first actual query at request time.
 *
 * `supabase` behaves like a real `SupabaseClient` thanks to the Proxy.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    const value = (client as never)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
}) as SupabaseClient;
