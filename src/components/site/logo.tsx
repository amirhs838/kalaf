"use client";

import { useRouter } from "@/lib/router";
import type { Category } from "@/lib/types";

export const NAV_ITEMS: { label: string; to: string; category?: Category }[] = [
  { label: "خانه", to: "/" },
  { label: "همه‌ی محصولات", to: "/shop" },
  { label: "عروسک‌ها", to: "/category/doll", category: "doll" },
  { label: "کیف‌ها", to: "/category/bag", category: "bag" },
  { label: "بافتنی‌ها", to: "/category/knitwear", category: "knitwear" },
  { label: "داستان ما", to: "/about" },
  { label: "تماس", to: "/contact" },
];

/** typographic logo + yarn-ball motif */
export function YarnBall({ className = "", size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle cx="20" cy="20" r="16" fill="#C2703D" />
      <g stroke="#FFFBF3" strokeWidth="1.6" fill="none" opacity="0.9" strokeLinecap="round">
        <path d="M5 16c6-5 24-5 30 0" />
        <path d="M5 24c6 5 24 5 30 0" />
        <path d="M9 9c4 7 4 15 0 22" />
        <path d="M31 9c-4 7-4 15 0 22" />
        <path d="M14 6c2 9 2 19 0 28" />
        <path d="M26 6c-2 9-2 19 0 28" />
      </g>
      <path
        d="M35 20c4 0 4 6 0 6"
        stroke="#C2703D"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ onClick }: { onClick?: () => void }) {
  const { navigate } = useRouter();
  return (
    <button
      onClick={() => {
        onClick?.();
        navigate("/");
      }}
      className="flex items-center gap-2.5 group"
      aria-label="کلاف و کاغذ — خانه"
    >
      <span className="transition-transform duration-300 group-hover:-rotate-12">
        <YarnBall />
      </span>
      <span className="flex flex-col items-start leading-none">
        <span
          className="text-[1.35rem] font-extrabold text-ink"
          style={{ fontFamily: "var(--font-display)" }}
        >
          کلاف و کاغذ
        </span>
        <span className="text-[0.62rem] text-muted-foreground tracking-wide mt-0.5">
          بافتنی‌های دست‌ساز
        </span>
      </span>
    </button>
  );
}
