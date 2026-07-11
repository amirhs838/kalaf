"use client";

import { useState } from "react";
import { useRouter } from "@/lib/router";
import { useCart, cartCount } from "@/lib/store";
import { Logo, NAV_ITEMS } from "./logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBag, Menu, PackageSearch, Lock } from "lucide-react";

export function Header() {
  const { navigate, path } = useRouter();
  const items = useCart((s) => s.items);
  const count = cartCount(items);
  const [open, setOpen] = useState(false);

  const isActive = (to: string) =>
    to === "/" ? path === "/" : path === to || path.startsWith(to + "/");

  const go = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <header className="sticky top-0 z-50 bg-canvas/90 backdrop-blur-md border-b border-kraft/70">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* mobile menu */}
          <div className="flex items-center gap-2 md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full text-ink hover:bg-cream"
                  aria-label="منو"
                >
                  <Menu size={20} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] max-w-xs bg-surface p-0">
                <div className="p-5 border-b border-kraft">
                  <Logo onClick={() => setOpen(false)} />
                </div>
                <nav className="flex flex-col p-3">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.to}
                      onClick={() => go(item.to)}
                      className={`text-right px-4 py-3 rounded-xl text-ink hover:bg-cream transition-colors ${
                        isActive(item.to) ? "bg-cream font-bold" : ""
                      }`}
                      style={{ fontFamily: isActive(item.to) ? "var(--font-display)" : undefined }}
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="stitch-line my-3" />
                  <button
                    onClick={() => go("/track")}
                    className="text-right px-4 py-3 rounded-xl text-ink hover:bg-cream flex items-center gap-2"
                  >
                    <PackageSearch size={17} /> پیگیری سفارش
                  </button>
                  <button
                    onClick={() => go("/admin")}
                    className="text-right px-4 py-3 rounded-xl text-muted-foreground hover:bg-cream flex items-center gap-2 text-sm"
                  >
                    <Lock size={15} /> پنل مدیریت
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* logo */}
          <Logo />

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                className={`px-3 py-2 rounded-full text-sm transition-colors ${
                  isActive(item.to)
                    ? "text-clay font-bold"
                    : "text-ink/80 hover:text-ink hover:bg-cream"
                }`}
                style={isActive(item.to) ? { fontFamily: "var(--font-display)" } : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate("/track")}
              className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full text-ink hover:bg-cream"
              aria-label="پیگیری سفارش"
              title="پیگیری سفارش"
            >
              <PackageSearch size={19} />
            </button>
            <button
              onClick={() => navigate("/admin")}
              className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full text-muted-foreground hover:bg-cream"
              aria-label="پنل مدیریت"
              title="پنل مدیریت"
            >
              <Lock size={17} />
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="relative inline-flex items-center justify-center w-11 h-11 rounded-full bg-clay text-white hover:bg-clay/90 active:translate-y-0.5 transition-all"
              aria-label={`سبد خرید، ${count} کالا`}
            >
              <ShoppingBag size={19} />
              {count > 0 && (
                <span
                  key={count}
                  className="absolute -top-1 -inset-inline-start-1 min-w-5 h-5 px-1 rounded-full bg-honey text-ink text-[0.65rem] font-bold flex items-center justify-center ring-2 ring-canvas"
                  style={{ animation: "kkpop 0.3s ease" }}
                >
                  {count.toString().replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d])}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes kkpop{0%{transform:scale(0.4)}60%{transform:scale(1.18)}100%{transform:scale(1)}}`}</style>
    </header>
  );
}
