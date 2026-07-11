import type { Product, Review, Order, OrderItem } from "./types";

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function mapProduct(p: {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  story: string | null;
  price: number;
  images: string;
  stock: number;
  isUnique: boolean;
  isFeatured: boolean;
  isNew: boolean;
  colors: string | null;
  materials: string | null;
  dimensions: string | null;
  prepDays: number;
  customizable: boolean;
  createdAt: Date;
}): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category as Product["category"],
    description: p.description,
    story: p.story,
    price: p.price,
    images: parseJsonArray(p.images),
    stock: p.stock,
    isUnique: p.isUnique,
    isFeatured: p.isFeatured,
    isNew: p.isNew,
    colors: parseJsonArray(p.colors),
    materials: p.materials,
    dimensions: p.dimensions,
    prepDays: p.prepDays,
    customizable: p.customizable,
    createdAt: p.createdAt.toISOString(),
  };
}

export function mapReview(r: {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  images: string | null;
  approved: boolean;
  createdAt: Date;
}): Review {
  return {
    id: r.id,
    productId: r.productId,
    customerName: r.customerName,
    rating: r.rating,
    comment: r.comment,
    images: parseJsonArray(r.images),
    approved: r.approved,
    createdAt: r.createdAt.toISOString(),
  };
}

export function mapOrderItem(i: {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  options: string | null;
}): OrderItem {
  return {
    id: i.id,
    productId: i.productId,
    productName: i.productName,
    unitPrice: i.unitPrice,
    quantity: i.quantity,
    options: i.options,
  };
}

export function mapOrder(
  o: {
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
    status: string;
    receiptPath: string | null;
    transactionCode: string | null;
    sellerNote: string | null;
    createdAt: Date;
    updatedAt: Date;
    items: ReturnType<typeof mapOrderItem>[];
  }
): Order {
  return {
    id: o.id,
    trackingCode: o.trackingCode,
    customerName: o.customerName,
    phone: o.phone,
    province: o.province,
    city: o.city,
    address: o.address,
    postalCode: o.postalCode,
    notes: o.notes,
    itemsTotal: o.itemsTotal,
    shippingCost: o.shippingCost,
    total: o.total,
    status: o.status as Order["status"],
    receiptPath: o.receiptPath,
    transactionCode: o.transactionCode,
    sellerNote: o.sellerNote,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
    items: o.items.map(mapOrderItem),
  };
}
