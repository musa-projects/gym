-- ============================================================
-- Big Vision Gym - Phase 5: Stripe Integration & Payments
-- ============================================================

-- ============================================================
-- STRIPE CUSTOMERS (links Supabase users to Stripe)
-- ============================================================
CREATE TABLE public.stripe_customers (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id  text NOT NULL UNIQUE,
  created_at          timestamptz DEFAULT now() NOT NULL,
  updated_at          timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_stripe_customers_updated_at
  BEFORE UPDATE ON public.stripe_customers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stripe customer"
  ON stripe_customers FOR SELECT USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Service role can manage stripe customers"
  ON stripe_customers FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE public.payments (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id text UNIQUE,
  stripe_invoice_id       text,
  amount_cents            integer NOT NULL CHECK (amount_cents >= 0),
  currency                text DEFAULT 'usd' NOT NULL,
  status                  text DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded', 'cancelled')),
  payment_type            text NOT NULL CHECK (payment_type IN ('subscription', 'one_time', 'pt_session', 'shop', 'guest_pass')),
  description             text,
  metadata                jsonb DEFAULT '{}'::jsonb,
  subscription_id         uuid REFERENCES public.member_subscriptions(id) ON DELETE SET NULL,
  created_at              timestamptz DEFAULT now() NOT NULL,
  updated_at              timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own payments"
  ON payments FOR SELECT USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Admins can manage all payments"
  ON payments FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- Add Stripe fields to member_subscriptions
-- ============================================================
ALTER TABLE public.member_subscriptions
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_price_id text,
  ADD COLUMN IF NOT EXISTS stripe_current_period_end timestamptz;

-- ============================================================
-- Add Stripe price IDs to membership_plans
-- ============================================================
ALTER TABLE public.membership_plans
  ADD COLUMN IF NOT EXISTS stripe_monthly_price_id text,
  ADD COLUMN IF NOT EXISTS stripe_yearly_price_id text,
  ADD COLUMN IF NOT EXISTS stripe_product_id text;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_stripe_customers_user ON public.stripe_customers(user_id);
CREATE INDEX idx_stripe_customers_stripe ON public.stripe_customers(stripe_customer_id);
CREATE INDEX idx_payments_user ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_type ON public.payments(payment_type);
CREATE INDEX idx_payments_stripe_intent ON public.payments(stripe_payment_intent_id);
CREATE INDEX idx_subscriptions_stripe ON public.member_subscriptions(stripe_subscription_id);
