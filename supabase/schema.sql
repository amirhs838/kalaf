-- ============================================================
-- کلاف و کاغذ — Supabase schema
-- این فایل را یک‌بار در Supabase Dashboard → SQL Editor → New query
-- اجرا کنید. جداول ساخته می‌شوند (اگر وجود ندارند).
-- ============================================================

-- Products
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  story text,
  price integer NOT NULL,
  images text NOT NULL DEFAULT '[]',
  stock integer NOT NULL DEFAULT 1,
  is_unique boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT false,
  colors text,
  materials text,
  dimensions text,
  prep_days integer NOT NULL DEFAULT 3,
  customizable boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_new ON products(is_new);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  tracking_code text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  phone text NOT NULL,
  province text NOT NULL,
  city text NOT NULL,
  address text NOT NULL,
  postal_code text,
  notes text,
  items_total integer NOT NULL,
  shipping_cost integer NOT NULL DEFAULT 0,
  total integer NOT NULL,
  status text NOT NULL DEFAULT 'pending_review',
  receipt_path text,
  receipt_original_name text,
  transaction_code text,
  seller_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_name text NOT NULL,
  unit_price integer NOT NULL,
  quantity integer NOT NULL,
  options text
);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  rating integer NOT NULL,
  comment text NOT NULL,
  images text,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON reviews(approved);

-- Admin sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  token text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

--.updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
