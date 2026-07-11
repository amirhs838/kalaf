-- اجرای سریع: فقط RLS را غیرفعال می‌کند (اگر جداول از قبل ساخته شده‌اند)
ALTER TABLE products        DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders          DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items     DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews         DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions  DISABLE ROW LEVEL SECURITY;
