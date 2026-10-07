-- ============================================================================
-- 004_subscriptions_and_payments.sql
-- UNIVERSAL COMPATIBILITY & RELATIONSHIP-DISCOVERY PLATFORM
-- Phase 11: Payments & Subscriptions Boundary Migration
-- Conforms to: DATA_MODEL.md, ARCHITECTURE_REVIEW.md D-23, and Master Build Prompt §33
--
-- INVARIANT D-23:
--  - Subscriptions and payments are strictly isolated from matching and ranking.
--  - NO foreign keys exist between matching/recommendations/evaluations and payment tables.
--  - No paid tier or transaction may alter compatibility scores, eligibility, or candidate visibility.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. ENUMS FOR SUBSCRIPTIONS & PAYMENTS
-- ----------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE subscription_plan AS ENUM (
    'free',
    'supporter',
    'patron',
    'verified_tier'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM (
    'active',
    'past_due',
    'canceled',
    'trialing',
    'incomplete'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'pending',
    'succeeded',
    'failed',
    'refunded'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_provider AS ENUM (
    'stripe',
    'mock'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ----------------------------------------------------------------------------
-- 2. SUBSCRIPTIONS TABLE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL DEFAULT 'free',
  status subscription_status NOT NULL DEFAULT 'active',
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_subscription UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions (user_id, status);

COMMENT ON TABLE subscriptions IS 
  'Stores monetization and supporter status. ISOLATED BOUNDARY: Strictly forbidden from being joined or referenced by matching or ranking logic (D-23, Spec §33).';

-- ----------------------------------------------------------------------------
-- 3. PAYMENTS TABLE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount_cents integer NOT NULL CHECK (amount_cents >= 0),
  currency varchar(3) NOT NULL DEFAULT 'USD',
  provider payment_provider NOT NULL DEFAULT 'mock',
  provider_payment_id varchar(255) NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  idempotency_key varchar(255) NOT NULL UNIQUE,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_idempotency ON payments (idempotency_key);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments (subscription_id);

COMMENT ON TABLE payments IS 
  'Append-only payment transaction records with strict idempotency verification (Spec §33).';
