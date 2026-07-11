/**
 * ابزارهای قالب‌بندی — اعداد و ارقام فارسی، قیمت تومانی
 */

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** تبدیل ارقام لاتین به فارسی */
export function toFa(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

/** قالب‌بندی قیمت به تومان با جداکننده هزارگان و ارقام فارسی */
export function formatToman(amount: number): string {
  const grouped = Math.round(amount).toLocaleString("en-US");
  return `${toFa(grouped)} تومان`;
}

/** قالب‌بندی عدد ساده با ارقام فارسی (بدون واحد) */
export function formatFaNumber(input: number): string {
  return toFa(Math.round(input).toLocaleString("en-US"));
}

/** تبدیل تاریخ به فرمت فارسی خلاصه */
export function formatFaDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return toFa(d.toLocaleString());
  }
}

/** فقط تاریخ فارسی */
export function formatFaDateOnly(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  } catch {
    return toFa(d.toLocaleDateString());
  }
}

/** تولید کد پیگیری سفارش */
export function generateTrackingCode(): string {
  const part = Math.random().toString(36).slice(2, 7).toUpperCase();
  const num = Math.floor(1000 + Math.random() * 9000);
  return `KK-${num}-${part}`;
}
