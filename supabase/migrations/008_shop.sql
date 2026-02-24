-- ============================================================
-- Big Vision Gym - Phase 10: Merchandise Shop
-- ============================================================

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE public.products (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  slug            text NOT NULL UNIQUE,
  description     text,
  category        text NOT NULL CHECK (category IN ('apparel', 'supplements', 'accessories', 'equipment', 'bundles')),
  base_price      integer NOT NULL CHECK (base_price >= 0), -- cents
  sale_price      integer CHECK (sale_price >= 0),           -- cents, null = no sale
  image_url       text,
  images          text[] DEFAULT '{}',
  is_featured     boolean DEFAULT false,
  is_active       boolean DEFAULT true,
  stock_qty       integer DEFAULT 0 CHECK (stock_qty >= 0),
  sku             text UNIQUE,
  tags            text[] DEFAULT '{}',
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON products FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- PRODUCT VARIANTS (sizes, colors)
-- ============================================================
CREATE TABLE public.product_variants (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name            text NOT NULL,              -- e.g. "Black / XL"
  size            text,
  color           text,
  price_override  integer CHECK (price_override >= 0), -- cents, null = use base_price
  stock_qty       integer DEFAULT 0 CHECK (stock_qty >= 0),
  sku             text UNIQUE,
  is_active       boolean DEFAULT true,
  created_at      timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active variants"
  ON product_variants FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage variants"
  ON product_variants FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE public.orders (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  order_number        text NOT NULL UNIQUE,
  status              text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal            integer NOT NULL CHECK (subtotal >= 0),       -- cents
  discount            integer DEFAULT 0 CHECK (discount >= 0),      -- cents
  tax                 integer DEFAULT 0 CHECK (tax >= 0),            -- cents
  total               integer NOT NULL CHECK (total >= 0),           -- cents
  shipping_name       text,
  shipping_email      text,
  shipping_phone      text,
  shipping_address    text,
  shipping_city       text,
  shipping_state      text,
  shipping_zip        text,
  payment_intent_id   text,
  payment_status      text DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'failed')),
  notes               text,
  created_at          timestamptz DEFAULT now() NOT NULL,
  updated_at          timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE public.order_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id      uuid REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id      uuid REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name    text NOT NULL,
  variant_name    text,
  quantity        integer NOT NULL CHECK (quantity > 0),
  unit_price      integer NOT NULL CHECK (unit_price >= 0),  -- cents
  total_price     integer NOT NULL CHECK (total_price >= 0), -- cents
  created_at      timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = (SELECT auth.uid()))
  );

CREATE POLICY "Users can create order items"
  ON order_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = (SELECT auth.uid()))
  );

CREATE POLICY "Admins can manage all order items"
  ON order_items FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_active ON public.products(is_active) WHERE is_active = true;
CREATE INDEX idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_number ON public.orders(order_number);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_order_items_product ON public.order_items(product_id);
