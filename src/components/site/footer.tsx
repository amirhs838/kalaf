"use client";

import { useRouter } from "@/lib/router";
import { shopConfig } from "@/lib/config";
import { Logo } from "./logo";
import { StitchDivider } from "./stitch-divider";
import { Instagram, Send, MessageCircle, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const { navigate } = useRouter();

  const ig = shopConfig.instagram;
  const tg = shopConfig.telegram;
  const wa = shopConfig.whatsapp;

  const socials = [
    { label: "اینستاگرام", href: `https://instagram.com/${ig}`, icon: Instagram, color: "#C2703D" },
    { label: "تلگرام", href: `https://t.me/${tg}`, icon: Send, color: "#8DA0BB" },
    { label: "واتساپ", href: `https://wa.me/${wa}`, icon: MessageCircle, color: "#8CA37A" },
  ];

  return (
    <footer className="mt-auto bg-surface border-t border-kraft">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* brand */}
          <div className="md:col-span-5">
            <Logo />
            <p className="text-sm text-muted-foreground mt-4 leading-7 max-w-sm">
              یک فروشگاه کوچک و خانگی. هر عروسک، هر کیف و هر بافتنی رو خودم، ردیف‌به‌ردیف، با دست
              بافتم — برای همینه که هیچ‌کدوم دقیقاً شبیه هم نیستن.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs bg-cream text-ink/80 px-3 py-1.5 rounded-full border border-kraft">
              <span className="w-1.5 h-1.5 rounded-full bg-clay" />
              پرداخت کارت‌به‌کارت، ارسال طبق مراحل
            </div>
          </div>

          {/* quick links */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-bold text-ink mb-3" style={{ fontFamily: "var(--font-display)" }}>
              دسترسی سریع
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { l: "همه‌ی محصولات", t: "/shop" },
                { l: "عروسک‌های بافتنی", t: "/category/doll" },
                { l: "کیف‌های بافتنی", t: "/category/bag" },
                { l: "داستان ما", t: "/about" },
                { l: "پیگیری سفارش", t: "/track" },
              ].map((i) => (
                <li key={i.t}>
                  <button
                    onClick={() => navigate(i.t)}
                    className="text-ink/70 hover:text-clay transition-colors"
                  >
                    {i.l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-bold text-ink mb-3" style={{ fontFamily: "var(--font-display)" }}>
              ارتباط با ما
            </h4>
            <div className="flex gap-2 mb-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-kraft bg-canvas hover:bg-cream transition-colors"
                  style={{ color: s.color }}
                  aria-label={s.label}
                  title={s.label}
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>
            <ul className="space-y-2 text-sm text-ink/70">
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-muted-foreground" />
                <span dir="ltr">{shopConfig.contactEmail}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-muted-foreground" />
                <span dir="ltr">+{shopConfig.contactPhone}</span>
              </li>
              <li className="flex items-center gap-2 text-xs leading-6">
                <MapPin size={15} className="text-muted-foreground shrink-0" />
                ارسال به سراسر ایران از طریق {shopConfig.shippingMethod} ({shopConfig.shippingDays})
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <StitchDivider withButton />
        </div>

        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(new Date())} کلاف و کاغذ — بافته‌شده با دست و عشق.</p>
          <p>طراحی‌شده، نه کپی‌شده.</p>
        </div>
      </div>
    </footer>
  );
}
