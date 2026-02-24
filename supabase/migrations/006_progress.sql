-- ============================================================
-- Big Vision Gym - Phase 8: Progress Tracking
-- ============================================================

-- ============================================================
-- PROGRESS MEASUREMENTS
-- ============================================================
CREATE TABLE public.progress_measurements (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  measured_at     date NOT NULL DEFAULT CURRENT_DATE,
  weight_kg       numeric(5,2),
  body_fat_pct    numeric(4,1),
  muscle_mass_kg  numeric(5,2),
  bmi             numeric(4,1),
  chest_cm        numeric(5,1),
  waist_cm        numeric(5,1),
  hips_cm         numeric(5,1),
  left_arm_cm     numeric(5,1),
  right_arm_cm    numeric(5,1),
  left_thigh_cm   numeric(5,1),
  right_thigh_cm  numeric(5,1),
  notes           text,
  created_at      timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.progress_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own measurements"
  ON progress_measurements FOR ALL USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Admins can view all measurements"
  ON progress_measurements FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- PROGRESS PHOTOS
-- ============================================================
CREATE TABLE public.progress_photos (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  photo_url       text NOT NULL,
  photo_type      text DEFAULT 'front' CHECK (photo_type IN ('front', 'side', 'back', 'other')),
  taken_at        date NOT NULL DEFAULT CURRENT_DATE,
  caption         text,
  is_private      boolean DEFAULT true,
  created_at      timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own photos"
  ON progress_photos FOR ALL USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Admins can view all photos"
  ON progress_photos FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- GOALS
-- ============================================================
CREATE TABLE public.goals (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title           text NOT NULL,
  description     text,
  goal_type       text NOT NULL CHECK (goal_type IN ('weight', 'measurement', 'performance', 'habit', 'custom')),
  target_value    numeric,
  current_value   numeric,
  unit            text,
  target_date     date,
  status          text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  completed_at    timestamptz,
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own goals"
  ON goals FOR ALL USING (user_id = (SELECT auth.uid()));

-- ============================================================
-- USER ACHIEVEMENTS
-- ============================================================
CREATE TABLE public.user_achievements (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_key text NOT NULL,
  title           text NOT NULL,
  description     text,
  icon            text,
  unlocked_at     timestamptz DEFAULT now() NOT NULL,
  UNIQUE (user_id, achievement_key)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT USING (user_id = (SELECT auth.uid()));

CREATE POLICY "System can insert achievements"
  ON user_achievements FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_progress_measurements_user ON public.progress_measurements(user_id);
CREATE INDEX idx_progress_measurements_date ON public.progress_measurements(user_id, measured_at DESC);
CREATE INDEX idx_progress_photos_user ON public.progress_photos(user_id);
CREATE INDEX idx_progress_photos_date ON public.progress_photos(user_id, taken_at DESC);
CREATE INDEX idx_goals_user ON public.goals(user_id);
CREATE INDEX idx_goals_status ON public.goals(user_id, status);
CREATE INDEX idx_user_achievements_user ON public.user_achievements(user_id);
