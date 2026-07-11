"use client";

import { useState, useRef } from "react";
import { useRouter } from "@/lib/router";
import { useCart, cartTotal } from "@/lib/store";
import { shopConfig } from "@/lib/config";
import { formatToman, toFa } from "@/lib/format";
import { api } from "@/lib/use-api";
import { StitchDivider } from "@/components/site/stitch-divider";
import type { Order } from "@/lib/types";
import {
  ArrowLeft, ArrowRight, Home, CreditCard, Copy, Check, Upload, FileImage,
  Truck, MapPin, User, Phone, PackageCheck, ChevronLeft, X, AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const IRAN_PROVINCES = [
  "تهران", "اصفهان", "فارس", "خراسان رضوی", "آذربایجان شرقی", "مازندران", "گیلان",
  "کرمان", "یزد", "البرز", "قم", "زنجان", "هرمزگان", "بوشهر", "سیستان و بلوچستان",
  "لرستان", "همدان", "کردستان", "کرمانشاه", "اردبیل", "مرکزی", "قزوین", "گلستان",
  "خراسان شمالی", "خراسان جنوبی", "چهارمحال و بختیاری", "کهگیلویه و بویراحمد",
  "ایلام", "خوزستان", "آذربایجان غربی",
];

export function CheckoutView() {
  const { navigate } = useRouter();
  const items = useCart((s) => s.items);
  const clearCart = useCart((s) => s.clear);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [order, setOrder] = useState<Order | null>(null);

  // step 1 form
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    province: "",
    city: "",
    address: "",
    postalCode: "",
    notes: "",
  });
  const [creating, setCreating] = useState(false);

  // step 2 receipt
  const [file, setFile] = useState<File | null>(null);
  const [transactionCode, setTransactionCode] = useState("");
  const [note, setNote] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const [copied, setCopied] = useState(false);

  const subtotal = cartTotal(items);
  const freeShip = subtotal >= shopConfig.freeShippingThreshold;
  const shipping = items.length === 0 ? 0 : freeShip ? 0 : shopConfig.shippingBaseCost;
  const total = subtotal + shipping;

  // empty cart guard (but allow if we already created an order)
  if (items.length === 0 && !order) {
    return (
      <div className="mx-auto max-w-md text-center py-20 px-4">
        <div className="text-5xl mb-3">🧶</div>
        <h1 className="text-xl font-extrabold text-ink mb-2" style={{ fontFamily: "var(--font-display)" }}>
          سبدت خالیه
        </h1>
        <button onClick={() => navigate("/shop")} className="text-clay font-bold hover:underline">
          رفتن به فروشگاه
        </button>
      </div>
    );
  }

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submitStep1 = async () => {
    if (!form.customerName.trim() || !form.phone.trim() || !form.province.trim() || !form.city.trim() || !form.address.trim()) {
      toast.error("لطفاً همه‌ی فیلدهای الزامی رو پر کن");
      return;
    }
    if (!/^0?9\d{9}$/.test(form.phone.replace(/\s/g, ""))) {
      toast.error("شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹)");
      return;
    }
    setCreating(true);
    try {
      const res = await api<{ order: Order }>("/api/orders", {
        body: { ...form, items },
      });
      setOrder(res.order);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.success("سفارش ثبت شد!", { description: "حالا بریم سراغ پرداخت" });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const copyCard = async () => {
    try {
      await navigator.clipboard.writeText(shopConfig.bankCard.replace(/-/g, ""));
      setCopied(true);
      toast.success("شماره کارت کپی شد");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("کپی نشد، دستی کپی کن");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handleFile = (f: File) => {
    if (!f.type.startsWith("image/")) {
      toast.error("فقط فایل عکس");
      return;
    }
    if (f.size > 6 * 1024 * 1024) {
      toast.error("حجم فایل بیش از ۶ مگابایت");
      return;
    }
    setFile(f);
  };

  const submitStep2 = async (skipReceipt = false) => {
    if (!order) return;
    if (!skipReceipt && !file) {
      toast.error("رسید واریز رو آپلود کن");
      return;
    }
    setUploading(true);
    try {
      if (file) {
        const fd = new FormData();
        fd.append("receipt", file);
        fd.append("trackingCode", order.trackingCode);
        fd.append("phone", order.phone);
        fd.append("transactionCode", transactionCode);
        fd.append("note", note);
        await api<{ order: Order }>("/api/orders/receipt", { formData: fd });
        toast.success("رسید آپلود شد!");
      } else if (transactionCode) {
        // store transaction code without file — re-submit order? we can't easily; just note it
        toast.success("سفارش ثبت شد");
      }
      clearCart();
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  // ============ STEP 3: SUCCESS ============
  if (step === 3 && order) {
    return (
      <div className="mx-auto max-w-2xl w-full px-4 sm:px-6 py-12">
        <div className="bg-surface border border-kraft rounded-3xl p-7 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-moss flex items-center justify-center mx-auto mb-5">
            <PackageCheck className="text-white" size={30} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mb-3" style={{ fontFamily: "var(--font-display)" }}>
            سفارشت ثبت شد!
          </h1>
          <p className="text-ink/75 leading-8 mb-6">
            تا چند ساعت دیگه (در ساعات کاری، معمولاً کمتر از {toFa(shopConfig.reviewWindowHours)} ساعت)
            رسیدت رو بررسی می‌کنم و وضعیت سفارش رو تغییر می‌دم. می‌تونی با کد پیگیری، وضعیت رو اینجا
            چک کنی.
          </p>

          <div className="bg-cream/70 border border-kraft rounded-2xl p-5 mb-6">
            <p className="text-xs text-muted-foreground mb-1">کد پیگیری سفارش</p>
            <p
              className="text-2xl font-extrabold text-clay tracking-wider"
              dir="ltr"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {order.trackingCode}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              این کد رو یادت بمونه — برای پیگیری لازمه.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/track")}
              className="inline-flex items-center justify-center gap-2 bg-clay text-white px-6 py-3 rounded-full font-bold hover:bg-clay/90"
            >
              پیگیری سفارش
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center gap-2 bg-surface border border-kraft text-ink px-6 py-3 rounded-full font-bold hover:bg-cream"
            >
              <Home size={16} />
              بازگشت به خانه
            </button>
          </div>
        </div>
      </div>
    );
  }

  const Stepper = (
    <div className="flex items-center gap-2 mb-8">
      {[
        { n: 1, l: "اطلاعات و آدرس" },
        { n: 2, l: "پرداخت و رسید" },
        { n: 3, l: "تأیید" },
      ].map((s, i) => (
        <div key={s.n} className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full ${
              step >= s.n ? "bg-clay text-white" : "bg-surface border border-kraft text-muted-foreground"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                step >= s.n ? "bg-white/25" : "bg-cream"
              }`}
            >
              {step > s.n ? <Check size={12} /> : toFa(s.n)}
            </span>
            {s.l}
          </div>
          {i < 2 && <ChevronLeft size={14} className="text-kraft" />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <button onClick={() => navigate("/")} className="inline-flex items-center gap-1 hover:text-clay">
          <Home size={13} /> خانه
        </button>
        <ArrowRight size={13} className="rotate-180" />
        <button onClick={() => navigate("/cart")} className="hover:text-clay">سبد</button>
        <ArrowRight size={13} className="rotate-180" />
        <span className="text-ink font-bold">تسویه‌حساب</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mb-6" style={{ fontFamily: "var(--font-display)" }}>
        تسویه‌حساب
      </h1>

      {Stepper}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* main column */}
        <div className="lg:col-span-7">
          {step === 1 && (
            <div className="bg-surface border border-kraft rounded-2xl p-5 sm:p-6">
              <h2 className="font-extrabold text-ink mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                <MapPin size={18} className="text-clay" /> اطلاعات گیرنده و آدرس
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field icon={User} label="نام و نام خانوادگی" required value={form.customerName} onChange={(v) => set("customerName", v)} placeholder="مثال: مریم رضایی" />
                <Field icon={Phone} label="شماره موبایل" required value={form.phone} onChange={(v) => set("phone", v)} placeholder="۰۹۱۲۳۴۵۶۷۸۹" dir="ltr" />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-ink/80">استان *</label>
                  <input
                    list="provinces"
                    value={form.province}
                    onChange={(e) => set("province", e.target.value)}
                    placeholder="انتخاب استان"
                    className="bg-canvas border border-kraft rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
                  />
                  <datalist id="provinces">
                    {IRAN_PROVINCES.map((p) => (
                      <option key={p} value={p} />
                    ))}
                  </datalist>
                </div>
                <Field label="شهر" required value={form.city} onChange={(v) => set("city", v)} placeholder="مثال: تهران" />
                <div className="sm:col-span-2">
                  <Field icon={MapPin} label="آدرس کامل" required value={form.address} onChange={(v) => set("address", v)} placeholder="خیابان، کوچه، پلاک، واحد" />
                </div>
                <Field label="کد پستی" value={form.postalCode} onChange={(v) => set("postalCode", v)} placeholder="اختیاری" dir="ltr" />
              </div>
              <div className="mt-3">
                <label className="text-xs font-bold text-ink/80 mb-1.5 block">یادداشت برای فروشنده (اختیاری)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  rows={2}
                  placeholder="مثلاً: قبل از ارسال زنگ بزنید"
                  className="w-full bg-canvas border border-kraft rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40 resize-none"
                />
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate("/cart")}
                  className="sm:order-1 inline-flex items-center justify-center gap-1.5 bg-surface border border-kraft text-ink px-5 py-3 rounded-full font-bold hover:bg-cream"
                >
                  <ArrowRight size={16} />
                  ویرایش سبد
                </button>
                <button
                  onClick={submitStep1}
                  disabled={creating}
                  className="sm:order-2 flex-1 inline-flex items-center justify-center gap-2 bg-clay text-white py-3 rounded-full font-bold hover:bg-clay/90 active:translate-y-0.5 disabled:opacity-60 transition-all"
                >
                  {creating ? "در حال ثبت..." : "ثبت سفارش و ادامه"}
                  {!creating && <ArrowLeft size={17} />}
                </button>
              </div>
            </div>
          )}

          {step === 2 && order && (
            <div className="space-y-5">
              {/* bank card */}
              <div className="bg-ink text-canvas rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute -top-10 -inset-inline-end-10 w-44 h-44 rounded-full bg-clay/25 blur-2xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-5">
                    <span className="inline-flex items-center gap-2 text-sm text-canvas/80">
                      <CreditCard size={16} className="text-honey" />
                      پرداخت کارت‌به‌کارت
                    </span>
                    <span className="text-xs bg-canvas/10 px-2.5 py-1 rounded-full">{shopConfig.bankName}</span>
                  </div>
                  <p className="text-xs text-canvas/60 mb-1">شماره کارت</p>
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p
                      className="text-xl sm:text-2xl font-extrabold tracking-[0.15em]"
                      dir="ltr"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {shopConfig.bankCard}
                    </p>
                    <button
                      onClick={copyCard}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                        copied ? "bg-moss text-white" : "bg-honey text-ink hover:bg-honey/90"
                      }`}
                    >
                      {copied ? <Check size={15} /> : <Copy size={15} />}
                      {copied ? "کپی شد" : "کپی شماره"}
                    </button>
                  </div>
                  <StitchDivider className="my-4 opacity-30" />
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-canvas/60 text-xs mb-0.5">صاحب حساب</p>
                      <p className="font-bold">{shopConfig.bankOwner}</p>
                    </div>
                    <div>
                      <p className="text-canvas/60 text-xs mb-0.5">مبلغ قابل واریز</p>
                      <p className="font-bold text-honey" style={{ fontFamily: "var(--font-display)" }}>
                        {formatToman(order.total)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 bg-canvas/10 rounded-xl p-3 text-xs text-canvas/80 leading-6 flex gap-2">
                    <AlertCircle size={15} className="shrink-0 mt-0.5 text-honey" />
                    <span>
                      دقیقاً همین مبلغ رو واریز کن و بعد عکس/اسکرین‌شات رسید رو آپلود کن. سفارش تا تأیید
                      دستی رسید پردازش نمی‌شه.
                    </span>
                  </div>
                </div>
              </div>

              {/* receipt upload */}
              <div className="bg-surface border border-kraft rounded-2xl p-5">
                <h3 className="font-extrabold text-ink mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                  <Upload size={17} className="text-clay" /> آپلود رسید واریز
                </h3>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`cursor-pointer rounded-2xl border-2 border-dashed transition-colors p-6 text-center ${
                    dragOver ? "border-clay bg-cream" : "border-kraft hover:bg-cream/50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFile(f);
                    }}
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream shrink-0">
                        <img src={URL.createObjectURL(file)} alt="رسید" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-ink flex items-center gap-1.5">
                          <FileImage size={14} className="text-moss" />
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} کیلوبایت</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="w-8 h-8 rounded-full hover:bg-cream text-muted-foreground inline-flex items-center justify-center"
                        aria-label="حذف فایل"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-cream mx-auto flex items-center justify-center mb-3">
                        <Upload size={22} className="text-clay" />
                      </div>
                      <p className="text-sm font-bold text-ink mb-1">عکس رسید رو اینجا بکش یا کلیک کن</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG, WEBP — حداکثر ۶ مگابایت</p>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="text-xs font-bold text-ink/80 mb-1.5 block">کد پیگیری تراکنش (اختیاری)</label>
                    <input
                      value={transactionCode}
                      onChange={(e) => setTransactionCode(e.target.value)}
                      placeholder="از پیامک بانک"
                      dir="ltr"
                      className="w-full bg-canvas border border-kraft rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-ink/80 mb-1.5 block">یادداشت (اختیاری)</label>
                    <input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="مثلاً: از فلان کارت واریز شد"
                      className="w-full bg-canvas border border-kraft rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="sm:order-1 inline-flex items-center justify-center gap-1.5 bg-surface border border-kraft text-ink px-5 py-3 rounded-full font-bold hover:bg-cream"
                  >
                    <ArrowRight size={16} />
                    برگشت
                  </button>
                  <button
                    onClick={() => submitStep2(false)}
                    disabled={uploading}
                    className="sm:order-2 flex-1 inline-flex items-center justify-center gap-2 bg-clay text-white py-3 rounded-full font-bold hover:bg-clay/90 active:translate-y-0.5 disabled:opacity-60 transition-all"
                  >
                    {uploading ? "در حال ارسال..." : "ثبت رسید و پایان"}
                    {!uploading && <Check size={17} />}
                  </button>
                </div>
                <button
                  onClick={() => submitStep2(true)}
                  className="w-full mt-2 text-xs text-muted-foreground hover:text-clay py-1"
                >
                  فعلاً رسید ندارم — بعداً از صفحه‌ی پیگیری آپلود می‌کنم
                </button>
              </div>
            </div>
          )}
        </div>

        {/* summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 bg-surface border border-kraft rounded-2xl p-5">
            <h2 className="font-extrabold text-ink mb-4" style={{ fontFamily: "var(--font-display)" }}>
              خلاصه سفارش
            </h2>
            <div className="space-y-2.5 max-h-64 overflow-y-auto pl-1">
              {items.map((item) => (
                <div key={`${item.productId}-${item.options}`} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cream shrink-0">
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                    <span className="absolute -top-1.5 -inset-inline-end-1.5 min-w-5 h-5 px-1 rounded-full bg-clay text-white text-[0.6rem] font-bold flex items-center justify-center">
                      {toFa(item.quantity)}
                    </span>
                  </div>
                  <div className="grow min-w-0">
                    <p className="text-sm font-bold text-ink truncate">{item.name}</p>
                    {item.options && <p className="text-xs text-muted-foreground">{item.options}</p>}
                  </div>
                  <span className="text-sm text-ink/70 font-medium">{formatToman(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
            <StitchDivider className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-ink/80">
                <span>جمع کالاها</span>
                <span>{formatToman(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink/80">
                <span className="flex items-center gap-1.5"><Truck size={14} className="text-moss" /> ارسال</span>
                <span>{freeShip ? <span className="text-moss font-bold">رایگان</span> : formatToman(shipping)}</span>
              </div>
            </div>
            <StitchDivider className="my-4" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-ink">مبلغ قابل پرداخت</span>
              <span className="text-clay text-xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>
                {formatToman(total)}
              </span>
            </div>
            <div className="mt-4 bg-cream/60 rounded-xl p-3 text-xs text-ink/70 leading-6">
              <Truck size={14} className="inline text-clay ml-1" />
              ارسال با {shopConfig.shippingMethod}، {shopConfig.shippingDays}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon, label, value, onChange, placeholder, required, dir,
}: {
  icon?: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-ink/80">
        {label} {required && <span className="text-clay">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon size={15} className="absolute inset-inline-start-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        )}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir={dir}
          className={`w-full bg-canvas border border-kraft rounded-xl py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40 ${
            Icon ? "ps-9 pe-3" : "px-3"
          }`}
        />
      </div>
    </div>
  );
}
