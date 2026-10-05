-- ============================================================================
-- 001_initial_schema.sql
-- UNIVERSAL COMPATIBILITY & RELATIONSHIP-DISCOVERY PLATFORM
-- Canonical PostgreSQL DDL Migration based on DATA_MODEL.md & ONTOLOGY.md
-- Version: 1.0.0
-- Invariants:
--  - Normalized schema; no wide generic table.
--  - Distinguish Identity, Intention, Requirement, Preference, Dealbreaker, Flexibility.
--  - Missing data != Incompatibility (absence = unknown).
--  - Immutable append-only audit_logs.
-- ============================================================================

-- Extensions required
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ----------------------------------------------------------------------------
-- 1. ENUMS & DOMAIN TYPES
-- ----------------------------------------------------------------------------

-- Requirement Levels (Spec §4, §5)
DO $$ BEGIN
  CREATE TYPE requirement_level AS ENUM (
    'MUST',
    'STRONG_PREFERENCE',
    'PREFERENCE',
    'NEUTRAL',
    'AVOID',
    'UNKNOWN'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- User Status
DO $$ BEGIN
  CREATE TYPE user_status AS ENUM (
    'pending_verification',
    'active',
    'paused',
    'suspended',
    'deleted'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Privacy Levels
DO $$ BEGIN
  CREATE TYPE privacy_level AS ENUM (
    'private',
    'matches_only',
    'members',
    'public'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Verification Status
DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM (
    'unverified',
    'pending',
    'verified',
    'rejected'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ----------------------------------------------------------------------------
-- 2. CORE USERS & DISPLAY PROFILE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext UNIQUE NOT NULL,
  password_hash text,
  status user_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  pronouns text,
  bio text DEFAULT '',
  photos jsonb NOT NULL DEFAULT '[]'::jsonb,
  visibility privacy_level NOT NULL DEFAULT 'members',
  current_stage smallint NOT NULL DEFAULT 1 CHECK (current_stage BETWEEN 1 AND 6),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3. ATTRIBUTE REGISTRY (ATTRIBUTE_DICTIONARY.md)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS attributes (
  id text PRIMARY KEY,
  name text NOT NULL,
  category smallint NOT NULL CHECK (category BETWEEN 1 AND 48),
  description text,
  value_type text NOT NULL,
  allowed_values jsonb,
  user_visible boolean NOT NULL DEFAULT true,
  required boolean NOT NULL DEFAULT false,
  optional boolean NOT NULL DEFAULT true,
  sensitive boolean NOT NULL DEFAULT false,
  highly_sensitive boolean NOT NULL DEFAULT false,
  searchable boolean NOT NULL DEFAULT false,
  filterable boolean NOT NULL DEFAULT false,
  matchable boolean NOT NULL DEFAULT false,
  hard_constraint_capable boolean NOT NULL DEFAULT false,
  preference_capable boolean NOT NULL DEFAULT false,
  weightable boolean NOT NULL DEFAULT false,
  privacy_level privacy_level NOT NULL DEFAULT 'matches_only',
  verification_possible boolean NOT NULL DEFAULT false,
  source text NOT NULL DEFAULT 'self_declared',
  confidence text DEFAULT 'self_declared',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_attr_req_opt CHECK (required <> optional),
  CONSTRAINT chk_attr_sensitivity CHECK (NOT highly_sensitive OR sensitive)
);

-- ----------------------------------------------------------------------------
-- 4. USER IDENTITY ATTRIBUTE VALUES (What a user IS)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS attribute_values (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  attribute_id text NOT NULL REFERENCES attributes(id) ON DELETE CASCADE,
  value jsonb,                     -- Raw JSON value if non-sensitive
  encrypted_value bytea,           -- AES-256 encrypted value if highly sensitive
  source text NOT NULL DEFAULT 'self_declared',
  perm_store boolean NOT NULL DEFAULT true,
  perm_display boolean NOT NULL DEFAULT false,
  perm_searchable boolean NOT NULL DEFAULT false,
  perm_matchable boolean NOT NULL DEFAULT true,
  perm_private boolean NOT NULL DEFAULT false,
  verified_status verification_status NOT NULL DEFAULT 'unverified',
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, attribute_id)
);

CREATE INDEX IF NOT EXISTS idx_attr_val_user ON attribute_values(user_id);
CREATE INDEX IF NOT EXISTS idx_attr_val_attr ON attribute_values(attribute_id);

-- ----------------------------------------------------------------------------
-- 5. USER PREFERENCES & CONSTRAINTS (What a user WANTS)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS preferences (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  attribute_id text NOT NULL REFERENCES attributes(id) ON DELETE CASCADE,
  value jsonb,                     -- Target values / range / object
  importance smallint CHECK (importance BETWEEN 1 AND 5),
  requirement_level requirement_level NOT NULL DEFAULT 'PREFERENCE',
  flexibility smallint NOT NULL DEFAULT 0 CHECK (flexibility BETWEEN 0 AND 100),
  dealbreaker boolean NOT NULL DEFAULT false,
  privacy_setting text NOT NULL DEFAULT 'private',
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, attribute_id)
);

CREATE INDEX IF NOT EXISTS idx_pref_user ON preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_pref_attr ON preferences(attribute_id);
CREATE INDEX IF NOT EXISTS idx_pref_dealbreaker ON preferences(dealbreaker) WHERE dealbreaker = true;

-- ----------------------------------------------------------------------------
-- 6. VIEWS FOR REQUIREMENTS & DEALBREAKERS (Resolving DATA_MODEL.md D-15)
-- Single source of truth in `preferences`, exposed as views
-- ----------------------------------------------------------------------------

CREATE OR REPLACE VIEW requirements AS
SELECT 
  user_id,
  attribute_id,
  value,
  importance,
  requirement_level,
  flexibility,
  dealbreaker,
  updated_at
FROM preferences
WHERE requirement_level = 'MUST';

CREATE OR REPLACE VIEW dealbreakers AS
SELECT 
  user_id,
  attribute_id,
  value,
  importance,
  requirement_level,
  flexibility,
  dealbreaker,
  updated_at
FROM preferences
WHERE dealbreaker = true;

-- ----------------------------------------------------------------------------
-- 7. GEOGRAPHIC LOCATION & SEARCH RADIUS (Privacy Coarsening)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_geography (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  city text,
  max_distance_km integer NOT NULL DEFAULT 50 CHECK (max_distance_km BETWEEN 1 AND 20000),
  open_to_long_distance boolean NOT NULL DEFAULT false,
  open_to_relocation boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 8. SAFETY, BLOCKS & REPORTS (SAFETY_SPEC.md)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS blocks (
  blocker_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (blocker_id, blocked_id),
  CONSTRAINT chk_no_self_block CHECK (blocker_id <> blocked_id)
);

CREATE INDEX IF NOT EXISTS idx_blocks_blocked ON blocks(blocked_id);

CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'pending',
  reviewer_id uuid REFERENCES users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_no_self_report CHECK (reporter_id <> reported_id)
);

-- ----------------------------------------------------------------------------
-- 9. MUTUAL CONNECTIONS & INTERACTION AUDIT
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_low_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_high_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  state text NOT NULL DEFAULT 'connected' CHECK (state IN ('connected', 'unmatched', 'blocked')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_connection_pair UNIQUE (user_low_id, user_high_id),
  CONSTRAINT chk_low_less_than_high CHECK (user_low_id < user_high_id)
);

CREATE TABLE IF NOT EXISTS interactions (
  id bigserial PRIMARY KEY,
  actor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (interaction_type IN ('interest', 'pass', 'unmatch', 'report')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_no_self_interaction CHECK (actor_id <> target_id)
);

CREATE INDEX IF NOT EXISTS idx_interactions_actor ON interactions(actor_id, target_id);

-- ----------------------------------------------------------------------------
-- 10. COMPATIBILITY EVALUATIONS AUDIT (Engine Diagnostics Snapshot)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS compatibility_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_b_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ruleset_version text NOT NULL,
  eligible boolean NOT NULL,
  mutual_score smallint CHECK (mutual_score BETWEEN 0 AND 100),
  score_a_to_b smallint CHECK (score_a_to_b BETWEEN 0 AND 100),
  score_b_to_a smallint CHECK (score_b_to_a BETWEEN 0 AND 100),
  confidence_score smallint CHECK (confidence_score BETWEEN 0 AND 100),
  hard_conflicts jsonb NOT NULL DEFAULT '[]'::jsonb,
  synergies jsonb NOT NULL DEFAULT '[]'::jsonb,
  frictions jsonb NOT NULL DEFAULT '[]'::jsonb,
  dimension_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  evaluated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comp_eval_pair ON compatibility_evaluations(user_a_id, user_b_id);

-- ----------------------------------------------------------------------------
-- 11. IMMUTABLE SYSTEM AUDIT LOGS (Write-Once-Read-Many)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS audit_logs (
  id bigserial PRIMARY KEY,
  actor_id uuid,
  actor_role text NOT NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id text,
  detail jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Deny updates and deletes on audit_logs for tamper-resistance
CREATE OR REPLACE RULE no_update_audit_logs AS ON UPDATE TO audit_logs DO INSTEAD NOTHING;
CREATE OR REPLACE RULE no_delete_audit_logs AS ON DELETE TO audit_logs DO INSTEAD NOTHING;

-- ----------------------------------------------------------------------------
-- 12. PRODUCT EVENTS PIPELINE (Spec §22)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS events (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  properties jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_user_time ON events(user_id, created_at);
