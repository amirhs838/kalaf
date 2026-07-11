export type Category = "doll" | "bag" | "knitwear";

export type OrderStatus =
  | "pending_review"
  | "payment_confirmed"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  description: string;
  story: string | null;
  price: number;
  images: string[];
  stock: number;
  isUnique: boolean;
  isFeatured: boolean;
  isNew: boolean;
  colors: string[];
  materials: string | null;
  dimensions: string | null;
  prepDays: number;
  customizable: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  images: string[];
  approved: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  options: string | null;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  options: string | null;
}

export interface Order {
  id: string;
  trackingCode: string;
  customerName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string | null;
  notes: string | null;
  itemsTotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  receiptPath: string | null;
  transactionCode: string | null;
  sellerNote: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export const CATEGORY_LABELS: Record<Category, string> = {
  doll: "عروسک‌های بافتنی",
  bag: "کیف‌های بافتنی",
  knitwear: "بافتنی‌ها",
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_review: "در انتظار بررسی پرداخت",
  payment_confirmed: "پرداخت تأییدشده",
  preparing: "در حال آماده‌سازی",
  shipped: "ارسال‌شده",
  delivered: "تحویل داده‌شده",
  cancelled: "لغو‌شده",
};

/** رنگ وضعیت سفارش مشتق‌شده از پالت کلاف و کاغذ */
export const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  pending_review: { bg: "#F6E6C1", text: "#8A6420", dot: "#DDA53B" }, // honey
  payment_confirmed: { bg: "#E2EAD8", text: "#4F6446", dot: "#8CA37A" }, // moss
  preparing: { bg: "#F4DCC8", text: "#8A4E25", dot: "#C2703D" }, // clay
  shipped: { bg: "#DEE5EE", text: "#46566B", dot: "#8DA0BB" }, // navy
  delivered: { bg: "#DCE8D4", text: "#3F5238", dot: "#6E8A5C" }, // deeper moss
  cancelled: { bg: "#F0D8D0", text: "#8C4A3C", dot: "#C27B6E" }, // muted rose
};

export const STATUS_FLOW: OrderStatus[] = [
  "pending_review",
  "payment_confirmed",
  "preparing",
  "shipped",
  "delivered",
];
