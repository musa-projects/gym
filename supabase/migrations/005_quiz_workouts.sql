-- ============================================================
-- Big Vision Gym - Phase 7: Onboarding Quiz & AI Workouts
-- ============================================================

-- ============================================================
-- ONBOARDING RESPONSES
-- ============================================================
CREATE TABLE public.onboarding_responses (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  fitness_level       text NOT NULL CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  primary_goal        text NOT NULL CHECK (primary_goal IN ('weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'stress_relief', 'general_fitness')),
  secondary_goals     text[] DEFAULT '{}',
  workout_frequency   integer NOT NULL CHECK (workout_frequency BETWEEN 1 AND 7),
  preferred_time      text CHECK (preferred_time IN ('morning', 'afternoon', 'evening', 'flexible')),
  limitations         text[] DEFAULT '{}',
  health_conditions   text,
  equipment_access    text[] DEFAULT '{}',
  experience_details  text,
  recommended_plan    text,
  recommended_classes text[] DEFAULT '{}',
  recommended_trainer text,
  completed_at        timestamptz DEFAULT now() NOT NULL,
  created_at          timestamptz DEFAULT now() NOT NULL,
  updated_at          timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_onboarding_responses_updated_at
  BEFORE UPDATE ON public.onboarding_responses
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own onboarding"
  ON onboarding_responses FOR SELECT USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own onboarding"
  ON onboarding_responses FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Admins can view all onboarding"
  ON onboarding_responses FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- GENERATED WORKOUTS
-- ============================================================
CREATE TABLE public.generated_workouts (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title               text NOT NULL,
  muscle_groups       text[] DEFAULT '{}',
  difficulty          text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes    integer NOT NULL CHECK (duration_minutes > 0),
  equipment           text[] DEFAULT '{}',
  workout_type        text DEFAULT 'general' CHECK (workout_type IN ('general', 'strength', 'hiit', 'cardio', 'flexibility', 'full_body')),
  content             text NOT NULL,
  is_favorite         boolean DEFAULT false,
  created_at          timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.generated_workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own workouts"
  ON generated_workouts FOR ALL USING (user_id = (SELECT auth.uid()));

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_onboarding_user ON public.onboarding_responses(user_id);
CREATE INDEX idx_generated_workouts_user ON public.generated_workouts(user_id);
CREATE INDEX idx_generated_workouts_created ON public.generated_workouts(created_at DESC);
CREATE INDEX idx_generated_workouts_favorite ON public.generated_workouts(user_id, is_favorite) WHERE is_favorite = true;
