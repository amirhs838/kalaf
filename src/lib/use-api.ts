"use client";

/* eslint-disable react-hooks/set-state-in-effect */
// Data-fetching in effects is a standard pattern; the synchronous setState
// calls here are intentional to drive loading state.

import { useEffect, useState, useCallback } from "react";

export function useApi<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!url);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    fetch(url)
      .then(async (r) => {
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          throw new Error(j.error || "خطا در دریافت اطلاعات");
        }
        return r.json();
      })
      .then((j) => {
        if (active) {
          setData(j);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (active) {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [url, nonce]);

  return { data, loading, error, reload };
}

/** POST/PUT/PATCH helper */
export async function api<T>(
  url: string,
  options?: { method?: string; body?: unknown; formData?: FormData }
): Promise<T> {
  const res = await fetch(url, {
    method: options?.method || "POST",
    body: options?.formData ?? (options?.body ? JSON.stringify(options.body) : undefined),
    headers: options?.formData
      ? undefined
      : { "Content-Type": "application/json" },
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((j as { error?: string }).error || "خطا");
  return j as T;
}
