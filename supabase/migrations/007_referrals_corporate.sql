-- ============================================================
-- Big Vision Gym - Phase 9: Referral System & Corporate Plans
-- ============================================================

-- ============================================================
-- REFERRALS
-- ============================================================
CREATE TABLE public.referrals (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id         uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  referral_code       text NOT NULL UNIQUE,
  referred_email      text,
  referred_name       text,
  status              text DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'subscribed', 'rewarded', 'expired')),
  reward_type         text CHECK (reward_type IN ('discount', 'free_month', 'credit', 'merch')),
  reward_amount       integer DEFAULT 0,
  reward_claimed      boolean DEFAULT false,
  expires_at          timestamptz,
  created_at          timestamptz DEFAULT now() NOT NULL,
  updated_at          timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals"
  ON referrals FOR SELECT USING (referrer_id = (SELECT auth.uid()));

CREATE POLICY "Users can create referrals"
  ON referrals FOR INSERT WITH CHECK (referrer_id = (SELECT auth.uid()));

CREATE POLICY "Admins can manage all referrals"
  ON referrals FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- Add referral_code to profiles for quick lookup
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;

-- ============================================================
-- CORPORATE ACCOUNTS
-- ============================================================
CREATE TABLE public.corporate_accounts (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name        text NOT NULL,
  contact_name        text NOT NULL,
  contact_email       text NOT NULL,
  contact_phone       text,
  company_size        text CHECK (company_size IN ('5-10', '11-25', '26-50', '51-100', '100+')),
  plan_type           text DEFAULT 'standard' CHECK (plan_type IN ('standard', 'premium', 'enterprise')),
  discount_pct        integer DEFAULT 15 CHECK (discount_pct BETWEEN 0 AND 50),
  max_members         integer NOT NULL CHECK (max_members >= 5),
  active_members      integer DEFAULT 0,
  status              text DEFAULT 'inquiry' CHECK (status IN ('inquiry', 'negotiating', 'active', 'suspended', 'cancelled')),
  start_date          date,
  end_date            date,
  notes               text,
  created_at          timestamptz DEFAULT now() NOT NULL,
  updated_at          timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_corporate_accounts_updated_at
  BEFORE UPDATE ON public.corporate_accounts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.corporate_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage corporate accounts"
  ON corporate_accounts FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- CORPORATE MEMBERS
-- ============================================================
CREATE TABLE public.corporate_members (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  corporate_id        uuid NOT NULL REFERENCES public.corporate_accounts(id) ON DELETE CASCADE,
  member_id           uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role                text DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at           timestamptz DEFAULT now() NOT NULL,
  UNIQUE (corporate_id, member_id)
);

ALTER TABLE public.corporate_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Corporate admins can view own members"
  ON corporate_members FOR SELECT USING (
    member_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM corporate_members cm
      WHERE cm.corporate_id = corporate_members.corporate_id
      AND cm.member_id = (SELECT auth.uid())
      AND cm.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage corporate members"
  ON corporate_members FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX idx_referrals_status ON public.referrals(status);
CREATE INDEX idx_corporate_accounts_status ON public.corporate_accounts(status);
CREATE INDEX idx_corporate_members_corporate ON public.corporate_members(corporate_id);
CREATE INDEX idx_corporate_members_member ON public.corporate_members(member_id);
CREATE INDEX idx_profiles_referral_code ON public.profiles(referral_code);
