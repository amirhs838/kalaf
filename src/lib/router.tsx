"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

/** Hash-based router so everything stays on the single `/` route. */

interface RouterCtx {
  path: string; // e.g. "/", "/shop", "/product/foo", "/category/doll"
  params: Record<string, string>;
  navigate: (to: string) => void;
}

const Ctx = createContext<RouterCtx | null>(null);

function parseHash(): { path: string; params: Record<string, string> } {
  const raw = window.location.hash.replace(/^#/, "");
  const [pathPart, queryPart] = raw.split("?");
  let path = pathPart || "/";
  if (!path.startsWith("/")) path = "/" + path;
  const params: Record<string, string> = {};
  if (queryPart) {
    for (const pair of queryPart.split("&")) {
      const [k, v] = pair.split("=");
      if (k) params[decodeURIComponent(k)] = decodeURIComponent(v ?? "");
    }
  }
  return { path, params };
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ path: string; params: Record<string, string> }>({
    path: "/",
    params: {},
  });

  useEffect(() => {
    const handler = () => {
      setState(parseHash());
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    if (!window.location.hash) {
      window.location.hash = "#/";
    }
    handler();
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = useCallback((to: string) => {
    const target = to.startsWith("#") ? to : "#" + (to.startsWith("/") ? to : "/" + to);
    if (window.location.hash === target) {
      // same hash — still scroll up
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.hash = target;
    }
  }, []);

  return (
    <Ctx.Provider value={{ path: state.path, params: state.params, navigate }}>
      {children}
    </Ctx.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useRouter must be used within RouterProvider");
  return ctx;
}

/** Match current path against a pattern. Returns params or null. */
export function matchRoute(pattern: string, path: string): Record<string, string> | null {
  const pp = pattern.split("/").filter(Boolean);
  const pa = path.split("/").filter(Boolean);
  if (pp.length !== pa.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < pp.length; i++) {
    if (pp[i].startsWith(":")) {
      params[pp[i].slice(1)] = decodeURIComponent(pa[i]);
    } else if (pp[i] !== pa[i]) {
      return null;
    }
  }
  return params;
}
