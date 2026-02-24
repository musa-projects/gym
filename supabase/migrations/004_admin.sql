-- ============================================================
-- Big Vision Gym - Phase 6: Admin Dashboard
-- ============================================================

-- ============================================================
-- LEAD NOTES (CRM activity on free_trial_leads)
-- ============================================================
CREATE TABLE public.lead_notes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id         uuid NOT NULL REFERENCES public.free_trial_leads(id) ON DELETE CASCADE,
  author_id       uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content         text NOT NULL,
  note_type       text DEFAULT 'note' CHECK (note_type IN ('note', 'call', 'email', 'sms', 'status_change', 'meeting')),
  created_at      timestamptz DEFAULT now() NOT NULL,
  updated_at      timestamptz DEFAULT now() NOT NULL
);

CREATE TRIGGER set_lead_notes_updated_at
  BEFORE UPDATE ON public.lead_notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage lead notes"
  ON lead_notes FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- ADMIN AUDIT LOG
-- ============================================================
CREATE TABLE public.admin_audit_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id        uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action          text NOT NULL,
  entity_type     text NOT NULL,
  entity_id       uuid,
  details         jsonb DEFAULT '{}'::jsonb,
  ip_address      inet,
  created_at      timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log"
  ON admin_audit_log FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role = 'admin')
  );

CREATE POLICY "Admins can insert audit log"
  ON admin_audit_log FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND app_role IN ('admin', 'staff'))
  );

-- ============================================================
-- Add pipeline_stage to free_trial_leads for CRM
-- ============================================================
ALTER TABLE public.free_trial_leads
  ADD COLUMN IF NOT EXISTS pipeline_stage text DEFAULT 'new' CHECK (pipeline_stage IN ('new', 'contacted', 'toured', 'trial_scheduled', 'trial_done', 'negotiating', 'converted', 'lost')),
  ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS lead_score integer DEFAULT 0 CHECK (lead_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS source text DEFAULT 'website' CHECK (source IN ('website', 'walkin', 'referral', 'social', 'google', 'other')),
  ADD COLUMN IF NOT EXISTS last_contacted_at timestamptz;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_lead_notes_lead ON public.lead_notes(lead_id);
CREATE INDEX idx_lead_notes_author ON public.lead_notes(author_id);
CREATE INDEX idx_audit_log_admin ON public.admin_audit_log(admin_id);
CREATE INDEX idx_audit_log_entity ON public.admin_audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created ON public.admin_audit_log(created_at DESC);
CREATE INDEX idx_leads_pipeline_stage ON public.free_trial_leads(pipeline_stage);
CREATE INDEX idx_leads_assigned_to ON public.free_trial_leads(assigned_to);
