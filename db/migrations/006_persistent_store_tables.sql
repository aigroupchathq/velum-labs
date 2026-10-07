-- ============================================================================
-- 006_persistent_store_tables.sql
-- UNIVERSAL COMPATIBILITY & RELATIONSHIP-DISCOVERY PLATFORM
-- Phase 12/13: Production Operational Store Tables for PostgreSQL
-- Conforms to: DATA_MODEL.md, ARCHITECTURE_REVIEW.md D-23, and Master Build Prompt §31-§35
--
-- INVARIANT D-23:
--  - Subscriptions and payments remain strictly isolated from matching and ranking.
--  - No foreign keys exist between matching and payment tables.
-- ============================================================================

-- 1. Persistent User Profile Store (Unified Normalized JSONB & Identity)
CREATE TABLE IF NOT EXISTS store_users (
  id VARCHAR(128) PRIMARY KEY,
  profile_data JSONB NOT NULL,
  completion_stage SMALLINT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_store_users_stage ON store_users(completion_stage);

-- 2. Tier 4 Encrypted Attributes (FLE AES-256-GCM)
CREATE TABLE IF NOT EXISTS store_encrypted_tier4 (
  user_id VARCHAR(128) NOT NULL,
  attribute_id VARCHAR(128) NOT NULL,
  encrypted_payload JSONB NOT NULL,
  perm_matchable BOOLEAN NOT NULL DEFAULT FALSE,
  perm_display BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, attribute_id)
);

CREATE INDEX IF NOT EXISTS idx_store_enc_user ON store_encrypted_tier4(user_id);

-- 3. Safety Blocks (Anti-Trilateration & Bidirectional Safety)
CREATE TABLE IF NOT EXISTS store_blocks (
  blocker_id VARCHAR(128) NOT NULL,
  blocked_id VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_id),
  CONSTRAINT chk_store_no_self_block CHECK (blocker_id <> blocked_id)
);

CREATE INDEX IF NOT EXISTS idx_store_blocks_blocked ON store_blocks(blocked_id);

-- 4. Safety Reports
CREATE TABLE IF NOT EXISTS store_reports (
  id VARCHAR(128) PRIMARY KEY,
  reporter_id VARCHAR(128) NOT NULL,
  reported_id VARCHAR(128) NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. User Interactions (Interest / Pass / Unmatch)
CREATE TABLE IF NOT EXISTS store_interactions (
  id BIGSERIAL PRIMARY KEY,
  actor_id VARCHAR(128) NOT NULL,
  target_id VARCHAR(128) NOT NULL,
  interaction_type VARCHAR(32) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_store_no_self_interact CHECK (actor_id <> target_id)
);

CREATE INDEX IF NOT EXISTS idx_store_interactions_actor ON store_interactions(actor_id, target_id);

-- 6. Direct In-App Messages
CREATE TABLE IF NOT EXISTS store_messages (
  id VARCHAR(128) PRIMARY KEY,
  connection_id VARCHAR(128) NOT NULL,
  sender_id VARCHAR(128) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_store_messages_conn ON store_messages(connection_id);

-- 7. Immutable WORM System Audit Logs
CREATE TABLE IF NOT EXISTS store_audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_id VARCHAR(128),
  actor_role VARCHAR(64) NOT NULL,
  action VARCHAR(128) NOT NULL,
  target_type VARCHAR(64) NOT NULL,
  target_id VARCHAR(128),
  detail JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_store_audit_action ON store_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_store_audit_created ON store_audit_logs(created_at);

-- Deny updates and deletes on store_audit_logs for immutable WORM compliance
CREATE OR REPLACE RULE no_update_store_audit_logs AS ON UPDATE TO store_audit_logs DO INSTEAD NOTHING;
CREATE OR REPLACE RULE no_delete_store_audit_logs AS ON DELETE TO store_audit_logs DO INSTEAD NOTHING;
