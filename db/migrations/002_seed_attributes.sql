-- ============================================================================
-- 002_seed_attributes.sql
-- UNIVERSAL COMPATIBILITY & RELATIONSHIP-DISCOVERY PLATFORM
-- Canonical Seed Data for Attribute Registry (ATTRIBUTE_DICTIONARY.md)
-- ============================================================================

INSERT INTO attributes (
  id, name, category, description, value_type, allowed_values,
  user_visible, required, optional, sensitive, highly_sensitive,
  searchable, filterable, matchable, hard_constraint_capable,
  preference_capable, weightable, privacy_level, verification_possible
) VALUES

-- 01. Demographics & Identity Basics
(
  'date_of_birth', 'Date of Birth', 1, 'Self-declared birth date for age and legal verification.',
  'date', null,
  false, true, false, false, false,
  false, true, true, true, true, true, 'private', true
),
(
  'pronouns', 'Pronouns', 1, 'Personal pronouns.',
  'multi_select', '["she/her", "he/him", "they/them", "other"]'::jsonb,
  true, false, true, false, false,
  false, false, false, false, false, false, 'members', false
),
(
  'gender_identity', 'Gender Identity', 2, 'Self-declared gender identity.',
  'multi_select', '["woman", "man", "non-binary", "trans woman", "trans man", "genderfluid", "agender", "other"]'::jsonb,
  true, false, true, true, false,
  true, true, true, true, true, false, 'members', false
),
(
  'genders_sought', 'Genders Sought', 2, 'Genders candidate is interested in connecting with.',
  'multi_select', '["woman", "man", "non-binary", "trans woman", "trans man", "genderfluid", "agender", "other"]'::jsonb,
  true, false, true, true, false,
  false, true, true, true, false, false, 'members', false
),
(
  'sexual_orientation', 'Sexual Orientation', 3, 'Orientation spectrum.',
  'multi_select', '["straight", "gay", "lesbian", "bisexual", "pansexual", "asexual", "demisexual", "queer", "questioning"]'::jsonb,
  true, false, true, true, false,
  false, false, true, false, true, false, 'matches_only', false
),

-- 05. Attraction Modalities (Spec §7, 6 Modalities)
(
  'attraction_importance', 'Attraction Priorities', 5, 'Relative weight placed on 6 distinct attraction modalities.',
  'object', '{"modalities": ["intellectual", "emotional", "physical", "romantic", "sexual", "social"]}'::jsonb,
  true, false, true, false, false,
  false, false, true, false, true, true, 'matches_only', false
),

-- 06. Relationship Intentions
(
  'relationship_intention', 'Primary Intention', 6, 'What the user seeks from human connection.',
  'multi_select', '["Long-Term Partnership / Marriage", "Committed Relationship", "Exploration / Casual", "Friendship / Community"]'::jsonb,
  true, false, true, false, false,
  true, true, true, true, true, true, 'members', false
),

-- 07. Relationship Structure
(
  'relationship_structure', 'Relationship Structure', 7, 'Philosophical structure of relational commitments.',
  'single_select', '["monogamous", "polyamorous", "enm", "relationship_anarchy", "flexible", "unsure"]'::jsonb,
  true, false, true, false, false,
  true, true, true, true, true, true, 'members', false
),

-- 09. Family & Children
(
  'has_children', 'Current Children', 9, 'Whether candidate currently has dependent children.',
  'single_select', '["none", "yes-live-with-me", "yes-part-time", "yes-adult"]'::jsonb,
  true, false, true, false, false,
  false, true, true, true, true, true, 'members', false
),
(
  'wants_children', 'Wants Children', 9, 'Desire for future children or family creation.',
  'single_select', '["definitely", "probably", "open", "probably not", "definitely not"]'::jsonb,
  true, false, true, false, false,
  false, true, true, true, true, true, 'members', false
),

-- 15. Core Values & Principles
(
  'core_values', 'Core Ethical Values', 15, 'Prioritized ethical and behavioral principles.',
  'multi_select', '["Integrity", "Autonomy", "Intellectual Curiosity", "Compassion", "Social Justice", "Ambition", "Spontaneity", "Tradition", "Creativity"]'::jsonb,
  true, false, true, false, false,
  false, false, true, false, true, true, 'members', false
),

-- 17. Communication & Conflict Styles
(
  'communication_style', 'Communication Style', 17, 'Cadence and conflict resolution approach.',
  'single_select', '["reflective deliberate", "direct immediate", "collaborative consensus", "processing solitary"]'::jsonb,
  true, false, true, false, false,
  false, false, true, false, true, true, 'members', false
),

-- 18. Substance & Health Lifestyles
(
  'smoking', 'Smoking & Vaping', 18, 'Tobacco and nicotine usage.',
  'single_select', '["never", "socially", "regularly", "trying to quit"]'::jsonb,
  true, false, true, false, false,
  false, true, true, true, true, true, 'members', false
),
(
  'alcohol', 'Alcohol Consumption', 18, 'Drinking frequency and habits.',
  'single_select', '["never", "rarely", "socially", "regularly"]'::jsonb,
  true, false, true, false, false,
  false, true, true, false, true, true, 'members', false
),

-- 20. Dietary Lifestyle
(
  'diet', 'Dietary Lifestyle', 20, 'Nutritional lifestyle commitments.',
  'single_select', '["omnivore", "vegetarian", "vegan", "pescatarian", "kosher", "halal", "other"]'::jsonb,
  true, false, true, false, false,
  false, true, true, true, true, true, 'members', false
),

-- 30. Spatial & Geographic Mobility
(
  'location', 'Geographic Coordinates', 30, 'Lat/Lon coordinate point for distance calculations.',
  'geo_point', null,
  false, false, true, true, false,
  false, true, true, true, true, true, 'private', true
),
(
  'max_distance_km', 'Search Horizon (km)', 30, 'Maximum travel distance radius.',
  'integer', '{"min": 1, "max": 20000}'::jsonb,
  true, false, true, false, false,
  false, false, true, true, false, false, 'private', false
),
(
  'open_to_long_distance', 'Open to Long-Distance', 31, 'Willingness to date outside local metro area.',
  'single_select', '["yes", "maybe", "no"]'::jsonb,
  true, false, true, false, false,
  false, true, true, true, true, true, 'members', false
),

-- 39. Verification & Trust
(
  'photo_verified', 'Biometric Photo Liveness', 39, 'Cryptographically verified real identity.',
  'boolean', null,
  true, false, true, false, false,
  true, true, true, true, true, false, 'members', true
)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  value_type = EXCLUDED.value_type,
  allowed_values = EXCLUDED.allowed_values,
  matchable = EXCLUDED.matchable,
  hard_constraint_capable = EXCLUDED.hard_constraint_capable,
  preference_capable = EXCLUDED.preference_capable,
  updated_at = now();
