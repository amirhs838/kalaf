import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  title: "کلاف و کاغذ | بافتنی‌های دست‌ساز",
  description:
    "عروسک‌های بافتنی، کیف‌های دست‌دوز و بافتنی‌های دست‌ساز — یکی‌یکی با دست بافته می‌شن. فروشگاه کوچک و خانگی کلاف و کاغذ.",
  keywords: [
    "عروسک بافتنی",
    "آمیگورومی",
    "کیف بافتنی",
    "بافتنی دست‌ساز",
    "کلاف و کاغذ",
    "کارت‌به‌کارت",
  ],
  authors: [{ name: "کلاف و کاغذ" }],
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "کلاف و کاغذ | بافتنی‌های دست‌ساز",
    description: "عروسک‌های بافتنی، کیف‌های دست‌دوز و بافتنی‌های دست‌ساز.",
    siteName: "کلاف و کاغذ",
    type: "website",
    locale: "fa_IR",
  },
};

export const viewport = {
  themeColor: "#FBF2E4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable} suppressHydrationWarning>
      <head>
        {/* Samim (display headings) — Persian open-source font by rastikerdar */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/rastikerdar/samim-font@v4.0.5/dist/font-face.css"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        {children}
        <Toaster
          position="top-center"
          dir="rtl"
          toastOptions={{
            style: {
              fontFamily: "var(--font-sans)",
              background: "#FFFBF3",
              color: "#3E2C23",
              border: "1px solid #E4D2B3",
              borderRadius: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}
