"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/lib/router";
import { api, useApi } from "@/lib/use-api";
import { formatToman, toFa, formatFaDate } from "@/lib/format";
import {
  STATUS_LABELS, STATUS_COLORS, STATUS_FLOW, type Order, type OrderStatus, type Product,
} from "@/lib/types";
import { StitchDivider } from "@/components/site/stitch-divider";
import {
  Home, ArrowRight, Lock, LogOut, Package, Boxes, Check, X, ChevronDown,
  Image as ImageIcon, Star, RefreshCw, Eye, Inbox,
} from "lucide-react";
import { toast } from "sonner";

export function AdminView() {
  const { navigate } = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"orders" | "inventory">("orders");

  // probe auth on mount
  useEffect(() => {
    fetch("/api/admin/orders?status=pending_review")
      .then((r) => setAuthed(r.ok))
      .catch(() => setAuthed(false));
  }, []);

  if (authed === null) {
    return <div className="mx-auto max-w-md text-center py-20 text-muted-foreground">در حال بررسی...</div>;
  }
  if (!authed) {
    return <LoginScreen onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <button onClick={() => navigate("/")} className="inline-flex items-center gap-1 hover:text-clay">
          <Home size={13} /> خانه
        </button>
        <ArrowRight size={13} className="rotate-180" />
        <span className="text-ink font-bold">پنل مدیریت</span>
      </nav>

      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink" style={{ fontFamily: "var(--font-display)" }}>
          پنل مدیریت کلاف و کاغذ
        </h1>
        <button
          onClick={async () => {
            await api("/api/admin/logout", { method: "POST" });
            setAuthed(false);
            toast("از پنل خارج شدی");
          }}
          className="inline-flex items-center gap-1.5 bg-surface border border-kraft text-ink px-4 py-2 rounded-full text-sm font-bold hover:bg-cream"
        >
          <LogOut size={15} /> خروج
        </button>
      </div>

      {/* tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("orders")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
            tab === "orders" ? "bg-clay text-white" : "bg-surface border border-kraft text-ink hover:bg-cream"
          }`}
        >
          <Package size={16} /> سفارش‌ها
        </button>
        <button
          onClick={() => setTab("inventory")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
            tab === "inventory" ? "bg-clay text-white" : "bg-surface border border-kraft text-ink hover:bg-cream"
          }`}
        >
          <Boxes size={16} /> موجودی و محصولات
        </button>
      </div>

      {tab === "orders" ? <OrdersPanel /> : <InventoryPanel />}
    </div>
  );
}

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api("/api/admin/login", { body: { username, password } });
      toast.success("خوش اومدی!");
      onSuccess();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm w-full px-4 py-16">
      <div className="bg-surface border border-kraft rounded-3xl p-7">
        <div className="w-14 h-14 rounded-full bg-cream border border-kraft flex items-center justify-center mx-auto mb-4">
          <Lock size={24} className="text-clay" />
        </div>
        <h1 className="text-xl font-extrabold text-ink text-center mb-1" style={{ fontFamily: "var(--font-display)" }}>
          ورود به پنل مدیریت
        </h1>
        <p className="text-xs text-muted-foreground text-center mb-5">فقط برای صاحب فروشگاه</p>
        <form onSubmit={submit} className="space-y-3">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="نام کاربری"
            className="w-full bg-canvas border border-kraft rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور"
            className="w-full bg-canvas border border-kraft rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-clay text-white py-2.5 rounded-full font-bold hover:bg-clay/90 disabled:opacity-60"
          >
            {loading ? "..." : "ورود"}
          </button>
        </form>
      </div>
    </div>
  );
}

function OrdersPanel() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("pending_review");
  const url = `/api/admin/orders${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`;
  const { data, loading, reload } = useApi<{ orders: Order[] }>(url);

  const orders = data?.orders ?? [];

  const filters: { v: OrderStatus | "all"; l: string }[] = [
    { v: "pending_review", l: "در انتظار رسید" },
    { v: "payment_confirmed", l: "تأییدشده" },
    { v: "preparing", l: "در حال آماده‌سازی" },
    { v: "shipped", l: "ارسال‌شده" },
    { v: "delivered", l: "تحویل‌شده" },
    { v: "cancelled", l: "لغو‌شده" },
    { v: "all", l: "همه" },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        {filters.map((f) => {
          const count =
            f.v === "all" ? null : null;
          return (
            <button
              key={f.v}
              onClick={() => setStatusFilter(f.v)}
              className={`shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full border transition-colors ${
                statusFilter === f.v
                  ? "bg-ink text-canvas border-ink"
                  : "bg-surface border-kraft text-ink/70 hover:bg-cream"
              }`}
            >
              {f.l}
            </button>
          );
        })}
        <button
          onClick={reload}
          className="shrink-0 w-8 h-8 rounded-full bg-surface border border-kraft hover:bg-cream flex items-center justify-center text-ink/60"
          aria-label="بروزرسانی"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 bg-cream rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-dashed border-kraft rounded-2xl">
          <Inbox size={32} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-ink font-bold">سفارشی در این وضعیت نیست</p>
          <p className="text-sm text-muted-foreground mt-1">آرام بافتنی‌ها رو بباف...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <AdminOrderCard key={o.id} order={o} onChanged={reload} />
          ))}
        </div>
      )}
    </div>
  );
}

function AdminOrderCard({ order, onChanged }: { order: Order; onChanged: () => void }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(order.sellerNote ?? "");
  const status = order.status as OrderStatus;
  const colors = STATUS_COLORS[status];

  const changeStatus = async (s: OrderStatus) => {
    try {
      await api(`/api/admin/orders/${order.id}`, { method: "PATCH", body: { status: s, sellerNote: note } });
      toast.success(`وضعیت به «${STATUS_LABELS[s]}» تغییر کرد`);
      onChanged();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const saveNote = async () => {
    try {
      await api(`/api/admin/orders/${order.id}`, { method: "PATCH", body: { sellerNote: note } });
      toast.success("یادداشت ذخیره شد");
      onChanged();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  // action buttons based on current status
  const actions: { s: OrderStatus; l: string; tone: "clay" | "moss" | "navy" | "rose" | "honey" }[] = [];
  if (status === "pending_review") {
    actions.push({ s: "payment_confirmed", l: "تأیید پرداخت", tone: "moss" });
    actions.push({ s: "cancelled", l: "رد پرداخت", tone: "rose" });
  } else if (status === "payment_confirmed") {
    actions.push({ s: "preparing", l: "شروع آماده‌سازی", tone: "clay" });
  } else if (status === "preparing") {
    actions.push({ s: "shipped", l: "ارسال شد", tone: "navy" });
  } else if (status === "shipped") {
    actions.push({ s: "delivered", l: "تحویل داده شد", tone: "moss" });
  }

  const toneClass: Record<string, string> = {
    clay: "bg-clay text-white hover:bg-clay/90",
    moss: "bg-moss text-white hover:bg-moss/90",
    navy: "bg-navy text-white hover:bg-navy/90",
    rose: "bg-rose text-white hover:bg-rose/90",
    honey: "bg-honey text-ink hover:bg-honey/90",
  };

  return (
    <div className="bg-surface border border-kraft rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 p-4 text-right hover:bg-cream/50"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ background: colors.dot }}
          />
          <div className="min-w-0">
            <p className="font-bold text-ink truncate" style={{ fontFamily: "var(--font-display)" }}>
              {order.customerName}
            </p>
            <p className="text-xs text-muted-foreground" dir="ltr">
              {order.trackingCode} · {formatFaDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span
            className="text-[0.65rem] font-bold px-2.5 py-1 rounded-full"
            style={{ background: colors.bg, color: colors.text }}
          >
            {STATUS_LABELS[status]}
          </span>
          <span className="text-clay font-bold text-sm">{formatToman(order.total)}</span>
          <ChevronDown size={16} className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="border-t border-kraft p-4 space-y-4">
          {/* customer + items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-ink/60 mb-1">اطلاعات گیرنده</p>
              <p className="text-sm text-ink/80 leading-7">
                {order.phone}
                <br />
                {order.province}، {order.city}، {order.address}
                {order.postalCode && <><br />کد پستی: <span dir="ltr">{order.postalCode}</span></>}
              </p>
              {order.notes && (
                <p className="text-xs text-muted-foreground bg-cream/60 rounded-lg p-2 mt-2">
                  یادداشت مشتری: {order.notes}
                </p>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-ink/60 mb-1">اقلام</p>
              <div className="space-y-1.5 text-sm">
                {order.items.map((it) => (
                  <div key={it.id} className="flex justify-between gap-2">
                    <span className="text-ink/80 truncate">{it.productName} {it.options ? `(${it.options})` : ""} ×{toFa(it.quantity)}</span>
                    <span className="text-ink/60">{formatToman(it.unitPrice * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* receipt */}
          {order.receiptPath ? (
            <div>
              <p className="text-xs font-bold text-ink/60 mb-1.5 flex items-center gap-1.5">
                <ImageIcon size={13} /> رسید واریز
                {order.transactionCode && <span className="text-muted-foreground font-normal">· کد: <span dir="ltr">{order.transactionCode}</span></span>}
              </p>
              <a href={order.receiptPath} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-cream rounded-xl p-2 border border-kraft hover:bg-cream/70">
                <img src={order.receiptPath} alt="رسید" className="w-24 h-24 object-cover rounded-lg" />
                <span className="text-xs text-clay font-bold inline-flex items-center gap-1">
                  <Eye size={13} /> دیدن کامل
                </span>
              </a>
            </div>
          ) : (
            <p className="text-xs text-rose bg-rose/10 rounded-lg p-2 inline-block">
              رسید آپلود نشده
            </p>
          )}

          <StitchDivider />

          {/* seller note */}
          <div>
            <label className="text-xs font-bold text-ink/60 mb-1.5 block">یادداشت داخلی (برای مشتری هم نمایش داده می‌شه)</label>
            <div className="flex gap-2">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="مثلاً: رسیدت نامعتبره، دوباره واریز کن"
                className="flex-1 bg-canvas border border-kraft rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
              />
              <button onClick={saveNote} className="bg-ink text-canvas px-4 rounded-xl text-sm font-bold hover:bg-ink/90">
                ذخیره
              </button>
            </div>
          </div>

          {/* status actions */}
          <div className="flex flex-wrap gap-2">
            {actions.map((a) => (
              <button
                key={a.s}
                onClick={() => changeStatus(a.s)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold ${toneClass[a.tone]}`}
              >
                {a.tone === "rose" ? <X size={15} /> : <Check size={15} />}
                {a.l}
              </button>
            ))}
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) changeStatus(e.target.value as OrderStatus);
              }}
              className="bg-surface border border-kraft rounded-full px-3 py-2 text-sm text-ink"
            >
              <option value="">تغییر دستی وضعیت...</option>
              {STATUS_FLOW.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
              <option value="cancelled">لغو‌شده</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

function InventoryPanel() {
  const { data, loading, reload } = useApi<{ products: Product[] }>("/api/products");
  const products = data?.products ?? [];

  if (loading) {
    return <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-cream rounded-xl animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-3">
        موجودی و قیمت هر محصول رو می‌تونی اینجا تغییر بدی. برای محصولات تک‌نسخه، بعد از فروش موجودی رو صفر کن.
      </p>
      {products.map((p) => (
        <InventoryRow key={p.id} product={p} onChanged={reload} />
      ))}
    </div>
  );
}

function InventoryRow({ product, onChanged }: { product: Product; onChanged: () => void }) {
  const [stock, setStock] = useState(product.stock);
  const [price, setPrice] = useState(product.price);
  const [featured, setFeatured] = useState(product.isFeatured);
  const [fresh, setFresh] = useState(product.isNew);
  const [saving, setSaving] = useState(false);

  const dirty =
    stock !== product.stock ||
    price !== product.price ||
    featured !== product.isFeatured ||
    fresh !== product.isNew;

  const save = async () => {
    setSaving(true);
    try {
      await api(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        body: { stock, price, isFeatured: featured, isNew: fresh },
      });
      toast.success(`${product.name} ذخیره شد`);
      onChanged();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-surface border border-kraft rounded-2xl p-3 flex flex-wrap items-center gap-3">
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-cream shrink-0">
        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="grow min-w-0">
        <p className="font-bold text-ink text-sm truncate" style={{ fontFamily: "var(--font-display)" }}>
          {product.name}
          {product.isUnique && <span className="text-xs text-navy mr-2">تک‌نسخه</span>}
        </p>
        <p className="text-xs text-muted-foreground">{toFa(product.stock)} موجود</p>
      </div>

      <label className="flex items-center gap-1.5 text-xs text-ink/70">
        موجودی
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Math.max(0, Number(e.target.value)))}
          className="w-16 bg-canvas border border-kraft rounded-lg px-2 py-1 text-sm text-center"
        />
      </label>
      <label className="flex items-center gap-1.5 text-xs text-ink/70">
        قیمت
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
          className="w-24 bg-canvas border border-kraft rounded-lg px-2 py-1 text-sm text-center"
        />
      </label>
      <label className="flex items-center gap-1 text-xs text-ink/70 cursor-pointer" title="محبوب">
        <button
          onClick={() => setFeatured((v) => !v)}
          className={`w-7 h-7 rounded-full flex items-center justify-center ${featured ? "bg-clay text-white" : "bg-cream text-muted-foreground"}`}
        >
          <Star size={13} className={featured ? "fill-white" : ""} />
        </button>
      </label>
      <label className="flex items-center gap-1 text-xs text-ink/70 cursor-pointer" title="تازه">
        <button
          onClick={() => setFresh((v) => !v)}
          className={`w-7 h-7 rounded-full flex items-center justify-center text-[0.6rem] font-bold ${fresh ? "bg-honey text-ink" : "bg-cream text-muted-foreground"}`}
        >
          جدید
        </button>
      </label>
      <button
        onClick={save}
        disabled={!dirty || saving}
        className="bg-clay text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-clay/90 disabled:opacity-40"
      >
        {saving ? "..." : "ذخیره"}
      </button>
    </div>
  );
}
