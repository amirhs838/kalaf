"use client";

import { useState } from "react";
import { useRouter } from "@/lib/router";
import { shopConfig } from "@/lib/config";
import { StitchDivider } from "@/components/site/stitch-divider";
import {
  ArrowRight, Home, Instagram, Send, MessageCircle, Mail, Phone, MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

export function ContactView() {
  const { navigate } = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const channels = [
    {
      label: "واتساپ",
      desc: "سریع‌ترین راه برای سوال پیش از خرید",
      href: `https://wa.me/${shopConfig.whatsapp}`,
      icon: MessageCircle,
      color: "#8CA37A",
    },
    {
      label: "تلگرام",
      desc: "پیام بده، در اولین فرصت جواب می‌دم",
      href: `https://t.me/${shopConfig.telegram}`,
      icon: Send,
      color: "#8DA0BB",
    },
    {
      label: "اینستاگرام",
      desc: "بافتنی‌های جدید رو اونجا می‌ذارم",
      href: `https://instagram.com/${shopConfig.instagram}`,
      icon: Instagram,
      color: "#C2703D",
    },
  ];

  const sendViaWhatsapp = () => {
    if (!name.trim() || !message.trim()) {
      toast.error("اسم و پیامت رو بنویس");
      return;
    }
    const text = `سلام کلاف و کاغذ 👋%0A%0Aاسم: ${encodeURIComponent(name)}%0A${phone ? `تلفن: ${encodeURIComponent(phone)}%0A` : ""}%0A${encodeURIComponent(message)}`;
    window.open(`https://wa.me/${shopConfig.whatsapp}?text=${text}`, "_blank");
    toast.success("واتساپ رو باز کردم — اگه باز نشد، مستقیم پیام بده");
  };

  return (
    <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
        <button onClick={() => navigate("/")} className="inline-flex items-center gap-1 hover:text-clay">
          <Home size={13} /> خانه
        </button>
        <ArrowRight size={13} className="rotate-180" />
        <span className="text-ink font-bold">تماس</span>
      </nav>

      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink mb-3" style={{ fontFamily: "var(--font-display)" }}>
          بزن بریم صحبت کنیم
        </h1>
        <p className="text-ink/70 max-w-xl mx-auto leading-8">
          سوالی داری؟ رنگ خاصی می‌خوای؟ می‌خوای قبل از خرید مطمئن بشی؟ راحت پیام بده — چون پرداخت
          کارت‌به‌کارت انجام می‌شه، اعتمادمون روی حرف‌زدنه.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* channels */}
        <div className="lg:col-span-5 space-y-3">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-surface border border-kraft rounded-2xl p-4 hover:bg-cream transition-colors group"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: c.color + "22" }}
              >
                <c.icon size={22} style={{ color: c.color }} />
              </div>
              <div className="grow">
                <p className="font-bold text-ink" style={{ fontFamily: "var(--font-display)" }}>{c.label}</p>
                <p className="text-xs text-muted-foreground">{c.desc}</p>
              </div>
              <ArrowRight size={16} className="text-muted-foreground group-hover:text-clay group-hover:-translate-x-0.5 transition-all" />
            </a>
          ))}

          <div className="flex gap-3">
            <a
              href={`mailto:${shopConfig.contactEmail}`}
              className="flex-1 flex items-center gap-2 bg-surface border border-kraft rounded-2xl p-3 hover:bg-cream text-sm"
            >
              <Mail size={16} className="text-clay" />
              <span dir="ltr" className="text-ink/70 truncate text-xs">{shopConfig.contactEmail}</span>
            </a>
            <a
              href={`tel:+${shopConfig.contactPhone}`}
              className="flex-1 flex items-center gap-2 bg-surface border border-kraft rounded-2xl p-3 hover:bg-cream text-sm"
            >
              <Phone size={16} className="text-clay" />
              <span dir="ltr" className="text-ink/70 text-xs">+{shopConfig.contactPhone}</span>
            </a>
          </div>
        </div>

        {/* form */}
        <div className="lg:col-span-7">
          <div className="bg-surface border border-kraft rounded-3xl p-6">
            <h2 className="font-extrabold text-ink mb-1 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
              <MessageSquare size={18} className="text-clay" /> فرم سریع
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              فرم رو پر کن، بعد با یک کلیک پیام از طریق واتساپ برام ارسال می‌شه.
            </p>
            <div className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اسمت"
                className="w-full bg-canvas border border-kraft rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="شماره تماس (اختیاری)"
                dir="ltr"
                className="w-full bg-canvas border border-kraft rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="پیامت... مثلاً: می‌خوام عروسک خرگوش رو ولی با رنگ آبی داشته باشم. ممکنه؟"
                className="w-full bg-canvas border border-kraft rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40 resize-none"
              />
              <button
                onClick={sendViaWhatsapp}
                className="w-full inline-flex items-center justify-center gap-2 bg-clay text-white py-3 rounded-full font-bold hover:bg-clay/90 active:translate-y-0.5 transition-all"
              >
                <MessageCircle size={17} />
                ارسال از طریق واتساپ
              </button>
            </div>
          </div>
        </div>
      </div>

      <StitchDivider withButton className="my-10" />

      <p className="text-center text-sm text-muted-foreground leading-7">
        یادت باشه: پرداخت کارت‌به‌کارت انجام می‌شه — واریز کنید و رسیدش رو آپلود کنید، من هم طبق
        مراحل براتون ارسال می‌کنم.
        <br />
        اگه جای ابهامی هست، قبل از خرید حتماً بپرس — با کمال میل جواب می‌دم.
      </p>
    </div>
  );
}
