-- ============================================================
-- Big Vision Gym - Phase 4: Memberships, Classes, Bookings
-- ============================================================

-- ============================================================
-- MEMBERSHIP PLANS
-- ============================================================
CREATE TABLE public.membership_plans (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  slug            text NOT NULL UNIQUE,
  tier            text NOT NULL CHECK (tier IN ('basic', 'premium', 'vip')),
  billing_cycle   text NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  price_cents     integer NOT NULL CHECK (price_cents >= 0),
  currency        text DEFAULT 'USD' NOT NULL,
  student_discount_pct integer DEFAULT 0 CHECK (student_discount_pct BETWEEN 0 AND 100),
  features        jsonb DEFAULT '[]'::jsonb,
  is_active       boolean DEFAULT true,
  sort_order      integer DEFAULT 0,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL,
  UNIQUE (tier, billing_cycle)
);

CREATE TRIGGER set_membership_plans_updated_at
  BEFORE UPDATE ON public.membership_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active plans"
  ON membership_plans FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage plans"
  ON membership_plans FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- MEMBER SUBSCRIPTIONS
-- ============================================================
CREATE TABLE public.member_subscriptions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id         uuid NOT NULL REFERENCES public.membership_plans(id),
  status          text DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'cancelled', 'expired', 'pending_payment')),
  start_date      date NOT NULL,
  end_date        date NOT NULL,
  auto_renew      boolean DEFAULT true,
  freeze_start    date,
  freeze_end      date,
  cancelled_at    timestamptz,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_date_range CHECK (end_date > start_date)
);

CREATE UNIQUE INDEX idx_one_active_subscription
  ON public.member_subscriptions (member_id)
  WHERE status IN ('active', 'frozen');

CREATE TRIGGER set_member_subscriptions_updated_at
  BEFORE UPDATE ON public.member_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.member_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own subscription"
  ON member_subscriptions FOR SELECT USING (member_id = (SELECT auth.uid()));

CREATE POLICY "Admins can manage subscriptions"
  ON member_subscriptions FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- TRAINERS (dedicated table, links to profiles optionally)
-- ============================================================
CREATE TABLE public.trainers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id      uuid UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name       text NOT NULL,
  email           text,
  phone           text,
  photo_url       text,
  bio             text,
  specialties     text[] DEFAULT '{}',
  certifications  text[] DEFAULT '{}',
  experience_years integer DEFAULT 0,
  is_active       boolean DEFAULT true,
  sort_order      integer DEFAULT 0,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_trainers_updated_at
  BEFORE UPDATE ON public.trainers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active trainers"
  ON trainers FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage trainers"
  ON trainers FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- CLASSES
-- ============================================================
CREATE TABLE public.classes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  slug            text NOT NULL UNIQUE,
  category        text NOT NULL CHECK (category IN ('hiit', 'strength', 'crossfit', 'yoga', 'boxing', 'personal_training', 'cardio', 'other')),
  description     text,
  short_description text,
  difficulty      text DEFAULT 'all_levels' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  max_capacity    integer NOT NULL CHECK (max_capacity > 0),
  default_trainer_id uuid REFERENCES public.trainers(id) ON DELETE SET NULL,
  image_url       text,
  calories_estimate text,
  is_active       boolean DEFAULT true,
  sort_order      integer DEFAULT 0,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active classes"
  ON classes FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage classes"
  ON classes FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- CLASS SCHEDULES (recurring weekly)
-- ============================================================
CREATE TABLE public.class_schedules (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id        uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  trainer_id      uuid REFERENCES public.trainers(id) ON DELETE SET NULL,
  day_of_week     text NOT NULL CHECK (day_of_week IN ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
  start_time      time NOT NULL,
  end_time        time NOT NULL,
  location        text,
  max_capacity_override integer,
  is_active       boolean DEFAULT true,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

CREATE TRIGGER set_class_schedules_updated_at
  BEFORE UPDATE ON public.class_schedules
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active schedules"
  ON class_schedules FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage schedules"
  ON class_schedules FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- CLASS SESSIONS (individual occurrences)
-- ============================================================
CREATE TABLE public.class_sessions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id     uuid NOT NULL REFERENCES public.class_schedules(id) ON DELETE CASCADE,
  class_id        uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  trainer_id      uuid REFERENCES public.trainers(id) ON DELETE SET NULL,
  session_date    date NOT NULL,
  start_time      time NOT NULL,
  end_time        time NOT NULL,
  location        text,
  max_capacity    integer NOT NULL,
  current_bookings integer DEFAULT 0,
  is_cancelled    boolean DEFAULT false,
  created_at      timestamptz DEFAULT now() NOT NULL,
  UNIQUE (schedule_id, session_date)
);

ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sessions"
  ON class_sessions FOR SELECT USING (true);

CREATE POLICY "Admins can manage sessions"
  ON class_sessions FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- CLASS BOOKINGS
-- ============================================================
CREATE TABLE public.class_bookings (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      uuid NOT NULL REFERENCES public.class_sessions(id) ON DELETE CASCADE,
  member_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status          text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'waitlisted', 'cancelled', 'attended', 'no_show')),
  waitlist_position integer,
  booked_at       timestamptz DEFAULT now() NOT NULL,
  checked_in_at   timestamptz,
  cancelled_at    timestamptz,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL,
  UNIQUE (session_id, member_id)
);

CREATE TRIGGER set_class_bookings_updated_at
  BEFORE UPDATE ON public.class_bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.class_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view own bookings"
  ON class_bookings FOR SELECT USING (member_id = (SELECT auth.uid()));

CREATE POLICY "Members can create bookings"
  ON class_bookings FOR INSERT WITH CHECK (member_id = (SELECT auth.uid()));

CREATE POLICY "Members can update own bookings"
  ON class_bookings FOR UPDATE USING (member_id = (SELECT auth.uid()));

CREATE POLICY "Admins can manage all bookings"
  ON class_bookings FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_member_subscriptions_member ON public.member_subscriptions(member_id);
CREATE INDEX idx_member_subscriptions_status ON public.member_subscriptions(status);
CREATE INDEX idx_class_sessions_date ON public.class_sessions(session_date);
CREATE INDEX idx_class_sessions_class ON public.class_sessions(class_id);
CREATE INDEX idx_class_bookings_member ON public.class_bookings(member_id);
CREATE INDEX idx_class_bookings_session ON public.class_bookings(session_id);
CREATE INDEX idx_class_bookings_status ON public.class_bookings(status);
