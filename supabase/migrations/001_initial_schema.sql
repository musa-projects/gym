-- ============================================================
-- Big Vision Gym - Initial Schema
-- Tables: profiles, free_trial_leads, contact_submissions
-- ============================================================

-- Helper: auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           text NOT NULL,
  full_name       text NOT NULL DEFAULT '',
  phone           text,
  avatar_url      text,
  app_role        text DEFAULT 'member' CHECK (app_role IN ('admin', 'staff', 'trainer', 'member')),
  is_active       boolean DEFAULT true,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
      AND app_role IN ('admin', 'staff')
    )
  );

-- ============================================================
-- FREE TRIAL LEADS (CRM)
-- ============================================================
CREATE TABLE public.free_trial_leads (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       text NOT NULL,
  email           text,
  phone           text NOT NULL,
  fitness_goal    text,
  preferred_time  text,
  status          text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'trial_scheduled', 'trial_completed', 'converted', 'lost')),
  notes           text,
  source          text DEFAULT 'website',
  converted_user_id uuid REFERENCES public.profiles(id),
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_free_trial_leads_updated_at
  BEFORE UPDATE ON public.free_trial_leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS: anyone can insert (public form), only admin/staff can read
ALTER TABLE public.free_trial_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a free trial lead"
  ON free_trial_leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view leads"
  ON free_trial_leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
      AND app_role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Admins can update leads"
  ON free_trial_leads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
      AND app_role IN ('admin', 'staff')
    )
  );

-- ============================================================
-- CONTACT SUBMISSIONS
-- ============================================================
CREATE TABLE public.contact_submissions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       text NOT NULL,
  email           text NOT NULL,
  phone           text,
  message         text NOT NULL,
  status          text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at      timestamptz DEFAULT now() NOT NULL
);

-- RLS: anyone can insert, only admin can read
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view contact submissions"
  ON contact_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = (SELECT auth.uid())
      AND app_role IN ('admin', 'staff')
    )
  );

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_profiles_app_role ON public.profiles(app_role);
CREATE INDEX idx_free_trial_leads_status ON public.free_trial_leads(status);
CREATE INDEX idx_free_trial_leads_created_at ON public.free_trial_leads(created_at DESC);
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);
