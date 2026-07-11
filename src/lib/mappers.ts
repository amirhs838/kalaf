import type {
  Product,
  Review,
  Order,
  OrderItem,
  ProductRow,
  OrderRow,
  OrderItemRow,
  ReviewRow,
} from "./types";

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function mapProduct(p: ProductRow): Product {
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
    isUnique: p.is_unique,
    isFeatured: p.is_featured,
    isNew: p.is_new,
    colors: parseJsonArray(p.colors),
    materials: p.materials,
    dimensions: p.dimensions,
    prepDays: p.prep_days,
    customizable: p.customizable,
    createdAt: p.created_at,
  };
}

export function mapReview(r: ReviewRow): Review {
  return {
    id: r.id,
    productId: r.product_id,
    customerName: r.customer_name,
    rating: r.rating,
    comment: r.comment,
    images: parseJsonArray(r.images),
    approved: r.approved,
    createdAt: r.created_at,
  };
}

export function mapOrderItem(i: OrderItemRow): OrderItem {
  return {
    id: i.id,
    productId: i.product_id,
    productName: i.product_name,
    unitPrice: i.unit_price,
    quantity: i.quantity,
    options: i.options,
  };
}

export function mapOrder(o: OrderRow, items: OrderItemRow[] = []): Order {
  return {
    id: o.id,
    trackingCode: o.tracking_code,
    customerName: o.customer_name,
    phone: o.phone,
    province: o.province,
    city: o.city,
    address: o.address,
    postalCode: o.postal_code,
    notes: o.notes,
    itemsTotal: o.items_total,
    shippingCost: o.shipping_cost,
    total: o.total,
    status: o.status as Order["status"],
    receiptPath: o.receipt_path,
    transactionCode: o.transaction_code,
    sellerNote: o.seller_note,
    createdAt: o.created_at,
    updatedAt: o.updated_at,
    items: items.map(mapOrderItem),
  };
}
