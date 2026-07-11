"use client";

import { useState } from "react";
import { useRouter } from "@/lib/router";
import { api, useApi } from "@/lib/use-api";
import { formatToman, toFa, formatFaDate } from "@/lib/format";
import {
  STATUS_LABELS, STATUS_COLORS, STATUS_FLOW, type Order, type OrderStatus,
} from "@/lib/types";
import { StitchDivider } from "@/components/site/stitch-divider";
import {
  ArrowRight, Home, Search, PackageSearch, Upload, Check, X, Truck,
  MapPin, Clock, FileImage,
} from "lucide-react";
import { toast } from "sonner";

export function TrackView() {
  const { navigate } = useRouter();
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const url =
    submitted && code && phone
      ? `/api/orders/track?code=${encodeURIComponent(code)}&phone=${encodeURIComponent(phone)}`
      : null;
  const { data, loading, error, reload } = useApi<{ order: Order }>(url);

  const order = data?.order ?? null;

  const lookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !phone.trim()) {
      toast.error("کد سفارش و شماره تلفن رو بنویس");
      return;
    }
    setSubmitted(true);
    setTimeout(reload, 0);
  };

  return (
    <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <button onClick={() => navigate("/")} className="inline-flex items-center gap-1 hover:text-clay">
          <Home size={13} /> خانه
        </button>
        <ArrowRight size={13} className="rotate-180" />
        <span className="text-ink font-bold">پیگیری سفارش</span>
      </nav>

      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-cream border border-kraft flex items-center justify-center mx-auto mb-3">
          <PackageSearch size={26} className="text-clay" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mb-2" style={{ fontFamily: "var(--font-display)" }}>
          پیگیری سفارش
        </h1>
        <p className="text-sm text-muted-foreground">
          کد پیگیری و شماره موبایلی که موقع سفارش وارد کردی رو بنویس.
        </p>
      </div>

      <form onSubmit={lookup} className="bg-surface border border-kraft rounded-2xl p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-ink/80 mb-1.5 block">کد پیگیری</label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="مثال: KK-1234-AB56C"
              dir="ltr"
              className="w-full bg-canvas border border-kraft rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-ink/80 mb-1.5 block">شماره موبایل</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              dir="ltr"
              className="w-full bg-canvas border border-kraft rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-clay text-white py-3 rounded-full font-bold hover:bg-clay/90 disabled:opacity-60"
        >
          <Search size={17} />
          {loading ? "در حال جستجو..." : "پیگیری"}
        </button>
      </form>

      {submitted && error && (
        <div className="bg-surface border border-rose/40 rounded-2xl p-5 text-center">
          <p className="text-ink font-bold mb-1">سفارش پیدا نشد</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      )}

      {order && <OrderResult order={order} onUpdated={reload} />}
    </div>
  );
}

function OrderResult({ order, onUpdated }: { order: Order; onUpdated: () => void }) {
  const status = order.status as OrderStatus;
  const colors = STATUS_COLORS[status];
  const isCancelled = status === "cancelled";
  const currentIdx = STATUS_FLOW.indexOf(status);

  return (
    <div className="space-y-5">
      {/* status banner */}
      <div
        className="rounded-2xl p-5 border"
        style={{ background: colors.bg, borderColor: colors.dot + "55" }}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: colors.dot, boxShadow: `0 0 0 4px ${colors.bg}` }}
            />
            <span className="font-extrabold text-lg" style={{ color: colors.text, fontFamily: "var(--font-display)" }}>
              {STATUS_LABELS[status]}
            </span>
          </div>
          <span className="text-xs text-ink/60" dir="ltr">{order.trackingCode}</span>
        </div>
        {isCancelled && (
          <p className="text-sm mt-3" style={{ color: colors.text }}>
            این سفارش لغو شده. اگه فکر می‌کنی اشتباه بوده، از طریق واتساپ در ارتباط باش.
          </p>
        )}
      </div>

      {/* timeline */}
      {!isCancelled && (
        <div className="bg-surface border border-kraft rounded-2xl p-5">
          <div className="flex items-center justify-between gap-1">
            {STATUS_FLOW.map((s, i) => {
              const done = i <= currentIdx;
              const c = STATUS_COLORS[s];
              return (
                <div key={s} className="flex-1 flex flex-col items-center text-center relative">
                  {i < STATUS_FLOW.length - 1 && (
                    <div
                      className="absolute top-3 inset-inline-start-1/2 w-full h-0.5 -z-0"
                      style={{
                        background: i < currentIdx ? c.dot : "var(--kraft)",
                      }}
                    />
                  )}
                  <div
                    className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center border-2"
                    style={{
                      background: done ? c.dot : "var(--surface)",
                      borderColor: done ? c.dot : "var(--kraft)",
                    }}
                  >
                    {done && <Check size={12} className="text-white" />}
                  </div>
                  <span
                    className="text-[0.62rem] mt-1.5 leading-tight"
                    style={{ color: done ? c.text : "var(--muted-foreground)" }}
                  >
                    {STATUS_LABELS[s]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* items + totals */}
      <div className="bg-surface border border-kraft rounded-2xl p-5">
        <h3 className="font-extrabold text-ink mb-3" style={{ fontFamily: "var(--font-display)" }}>
          اقلام سفارش
        </h3>
        <div className="space-y-3">
          {order.items.map((it) => (
            <div key={it.id} className="flex items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                <p className="font-bold text-ink truncate">{it.productName}</p>
                {it.options && <p className="text-xs text-muted-foreground">{it.options}</p>}
              </div>
              <div className="text-left shrink-0">
                <p className="text-ink/70">{toFa(it.quantity)} عدد</p>
                <p className="text-clay font-bold">{formatToman(it.unitPrice * it.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
        <StitchDivider className="my-4" />
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-ink/80">
            <span>جمع کالاها</span>
            <span>{formatToman(order.itemsTotal)}</span>
          </div>
          <div className="flex justify-between text-ink/80">
            <span className="flex items-center gap-1.5"><Truck size={14} className="text-moss" /> ارسال</span>
            <span>{order.shippingCost === 0 ? <span className="text-moss font-bold">رایگان</span> : formatToman(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between font-bold text-ink pt-1">
            <span>مبلغ کل</span>
            <span className="text-clay text-base" style={{ fontFamily: "var(--font-display)" }}>{formatToman(order.total)}</span>
          </div>
        </div>
      </div>

      {/* address */}
      <div className="bg-surface border border-kraft rounded-2xl p-5">
        <h3 className="font-extrabold text-ink mb-2 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
          <MapPin size={16} className="text-clay" /> آدرس ارسال
        </h3>
        <p className="text-sm text-ink/80 leading-7">
          {order.customerName} — {order.phone}
          <br />
          {order.province}، {order.city}، {order.address}
          {order.postalCode && <span> — کد پستی: <span dir="ltr">{order.postalCode}</span></span>}
        </p>
        {order.notes && (
          <p className="text-xs text-muted-foreground mt-2 bg-cream/60 rounded-lg p-2.5">
            یادداشت: {order.notes}
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
          <Clock size={13} /> ثبت: {formatFaDate(order.createdAt)}
        </p>
      </div>

      {/* receipt */}
      {order.receiptPath ? (
        <div className="bg-surface border border-kraft rounded-2xl p-5">
          <h3 className="font-extrabold text-ink mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
            <FileImage size={16} className="text-moss" /> رسید واریز
          </h3>
          <a
            href={order.receiptPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <img
              src={order.receiptPath}
              alt="رسید واریز"
              className="w-40 h-40 object-cover rounded-xl border border-kraft"
            />
          </a>
          {order.transactionCode && (
            <p className="text-xs text-muted-foreground mt-2">کد پیگیری تراکنش: <span dir="ltr">{order.transactionCode}</span></p>
          )}
        </div>
      ) : (
        status === "pending_review" && (
          <ReceiptUpload order={order} onUploaded={onUpdated} />
        )
      )}

      {order.sellerNote && (
        <div className="bg-cream/70 border border-kraft rounded-2xl p-4">
          <p className="text-xs font-bold text-clay mb-1">پیام از فروشنده</p>
          <p className="text-sm text-ink/80 leading-7">{order.sellerNote}</p>
        </div>
      )}
    </div>
  );
}

function ReceiptUpload({ order, onUploaded }: { order: Order; onUploaded: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [transactionCode, setTransactionCode] = useState("");
  const [uploading, setUploading] = useState(false);

  const upload = async () => {
    if (!file) {
      toast.error("اول فایل رسید رو انتخاب کن");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("receipt", file);
      fd.append("trackingCode", order.trackingCode);
      fd.append("phone", order.phone);
      fd.append("transactionCode", transactionCode);
      await api("/api/orders/receipt", { formData: fd });
      toast.success("رسید آپلود شد!");
      onUploaded();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-surface border border-kraft border-dashed rounded-2xl p-5">
      <h3 className="font-extrabold text-ink mb-2 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
        <Upload size={16} className="text-clay" /> رسیدت رو آپلود کن
      </h3>
      <p className="text-sm text-muted-foreground mb-3">
        هنوز رسیدی برای این سفارش ثبت نشده. اگه واریز کردی، عکس رسید رو اینجا بفرست.
      </p>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="block w-full text-sm text-ink/70 file:ms-0 file:me-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-cream file:text-ink file:font-bold file:cursor-pointer"
      />
      <input
        value={transactionCode}
        onChange={(e) => setTransactionCode(e.target.value)}
        placeholder="کد پیگیری تراکنش (اختیاری)"
        dir="ltr"
        className="w-full mt-3 bg-canvas border border-kraft rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
      />
      <button
        onClick={upload}
        disabled={uploading}
        className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-clay text-white py-2.5 rounded-full font-bold hover:bg-clay/90 disabled:opacity-60"
      >
        {uploading ? "در حال آپلود..." : "آپلود رسید"}
        {!uploading && <Upload size={15} />}
      </button>
    </div>
  );
}
