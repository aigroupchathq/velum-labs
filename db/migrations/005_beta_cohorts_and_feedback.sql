-- ============================================================================
-- 005_beta_cohorts_and_feedback.sql
-- KIN: HUMAN COMPATIBILITY & RELATIONSHIP-DISCOVERY PLATFORM
-- Phase 13: Controlled Beta, Cohort Gates & Post-Encounter Feedback
-- Conforms to: Master Build Specification §34, §38 (Phase 13)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ENUMS FOR COHORTS & ENCOUNTER FEEDBACK
-- ----------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE beta_cohort_status AS ENUM (
    'forming',
    'active',
    'paused',
    'graduated'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE invite_code_status AS ENUM (
    'available',
    'claimed',
    'revoked'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE date_feedback_sentiment AS ENUM (
    'felt_psychological_safety',
    'sensory_environment_appropriate',
    'values_aligned',
    'respectful_mismatch',
    'boundary_breach'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ----------------------------------------------------------------------------
-- 2. BETA COHORTS (Geographic & Density Balanced)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS beta_cohorts (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  geographic_cluster VARCHAR(128) NOT NULL,
  max_participants INT NOT NULL DEFAULT 50,
  current_participants INT NOT NULL DEFAULT 0,
  status beta_cohort_status NOT NULL DEFAULT 'forming',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  activated_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- ----------------------------------------------------------------------------
-- 3. INVITE CODES (Controlled Access Gating)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS beta_invites (
  code VARCHAR(32) PRIMARY KEY,
  cohort_id VARCHAR(64) REFERENCES beta_cohorts(id) ON DELETE SET NULL,
  issued_by_user_id VARCHAR(64),
  claimed_by_user_id VARCHAR(64),
  status invite_code_status NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  claimed_at TIMESTAMPTZ
);

-- ----------------------------------------------------------------------------
-- 4. POST-ENCOUNTER PSYCHOLOGICAL FEEDBACK (Outcome & Dignity Measurement)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS encounter_feedbacks (
  id VARCHAR(64) PRIMARY KEY,
  encounter_id VARCHAR(64) NOT NULL,
  evaluator_user_id VARCHAR(64) NOT NULL,
  partner_user_id VARCHAR(64) NOT NULL,
  felt_safe BOOLEAN NOT NULL DEFAULT true,
  sensory_venue_comfort INT NOT NULL CHECK (sensory_venue_comfort BETWEEN 1 AND 5),
  desire_second_encounter BOOLEAN NOT NULL DEFAULT false,
  graceful_closure_requested BOOLEAN NOT NULL DEFAULT false,
  sentiments TEXT[] NOT NULL DEFAULT '{}',
  qualitative_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. INDEXES
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_beta_cohorts_cluster ON beta_cohorts(geographic_cluster);
CREATE INDEX IF NOT EXISTS idx_beta_invites_code ON beta_invites(code);
CREATE INDEX IF NOT EXISTS idx_encounter_feedbacks_evaluator ON encounter_feedbacks(evaluator_user_id);
CREATE INDEX IF NOT EXISTS idx_encounter_feedbacks_partner ON encounter_feedbacks(partner_user_id);
