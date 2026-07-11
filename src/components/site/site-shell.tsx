"use client";

import { useRouter, matchRoute } from "@/lib/router";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { HomeView } from "@/components/views/home-view";
import { ShopView } from "@/components/views/shop-view";
import { ProductView } from "@/components/views/product-view";
import { CartView } from "@/components/views/cart-view";
import { CheckoutView } from "@/components/views/checkout-view";
import { TrackView } from "@/components/views/track-view";
import { AdminView } from "@/components/views/admin-view";
import { AboutView } from "@/components/views/about-view";
import { ContactView } from "@/components/views/contact-view";
import { useRouter as _useRouter } from "@/lib/router";

function NotFound() {
  const { navigate } = _useRouter();
  return (
    <div className="mx-auto max-w-md text-center py-24 px-4">
      <div className="text-6xl mb-4">🧶</div>
      <h1 className="text-2xl font-extrabold text-ink mb-2" style={{ fontFamily: "var(--font-display)" }}>
        این صفحه بافته نشده!
      </h1>
      <p className="text-muted-foreground mb-6">صفحه‌ای که دنبالش بودی پیدا نشد.</p>
      <button
        onClick={() => navigate("/")}
        className="inline-flex items-center gap-2 bg-clay text-white px-5 py-2.5 rounded-full font-bold hover:bg-clay/90"
      >
        برگشت به خانه
      </button>
    </div>
  );
}

function ViewLoader() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="w-40 h-1.5 rounded-full knit-loader overflow-hidden relative">
          <div className="absolute inset-0 bg-canvas" style={{ animation: "knitgrow 1.2s ease-in-out infinite" }} />
        </div>
        <p className="text-sm text-muted-foreground">دارم می‌بافمش...</p>
      </div>
      <style>{`@keyframes knitgrow{0%{transform:translateX(0)}100%{transform:translateX(-100%)}}`}</style>
    </div>
  );
}

export function SiteShell() {
  const { path, params } = useRouter();

  let view: React.ReactNode;
  if (path === "/") {
    view = <HomeView />;
  } else if (path === "/shop" || matchRoute("/category/:slug", path)) {
    const m = matchRoute("/category/:slug", path);
    const cat = m?.slug ?? null;
    view = <ShopView key={cat ?? "all"} category={cat} initialParams={params} />;
  } else if (matchRoute("/product/:slug", path)) {
    const m = matchRoute("/product/:slug", path)!;
    view = <ProductView slug={m.slug} />;
  } else if (path === "/cart") {
    view = <CartView />;
  } else if (path === "/checkout") {
    view = <CheckoutView />;
  } else if (path === "/track") {
    view = <TrackView />;
  } else if (path === "/admin") {
    view = <AdminView />;
  } else if (path === "/about") {
    view = <AboutView />;
  } else if (path === "/contact") {
    view = <ContactView />;
  } else {
    view = <NotFound />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 flex flex-col">{view}</main>
      <Footer />
    </div>
  );
}
