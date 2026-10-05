-- ============================================================================
-- 003_seed_canonical_profiles.sql
-- UNIVERSAL COMPATIBILITY & RELATIONSHIP-DISCOVERY PLATFORM
-- Canonical Test Users Seed: Elena (Self), Maya (Mutual Fit), Liam (Dealbreaker),
-- Sora (Controlled Flexibility), Devon (Structure Conflict), Nadia (Uncertainty)
-- ============================================================================

-- Insert Test Users
INSERT INTO users (id, email, status) VALUES
('11111111-1111-1111-1111-111111111111', 'elena@example.com', 'active'),
('22222222-2222-2222-2222-222222222222', 'maya@example.com', 'active'),
('33333333-3333-3333-3333-333333333333', 'liam@example.com', 'active'),
('44444444-4444-4444-4444-444444444444', 'sora@example.com', 'active'),
('55555555-5555-5555-5555-555555555555', 'devon@example.com', 'active'),
('66666666-6666-6666-6666-666666666666', 'nadia@example.com', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert Display Profiles
INSERT INTO profiles (user_id, display_name, pronouns, bio, photos, visibility, current_stage) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Elena Rostova', 'she/her',
  'Bioethics researcher & classical cellist. Seeking an intellectual partner for long-term domestic life.',
  '["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"]'::jsonb,
  'members', 6
),
(
  '22222222-2222-2222-2222-222222222222',
  'Maya Lin', 'she/her',
  'Architectural designer focusing on sustainable timber structures. Deep listener, weekend backpacker.',
  '["https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800"]'::jsonb,
  'members', 6
),
(
  '33333333-3333-3333-3333-333333333333',
  'Liam Vance', 'he/him',
  'Documentary cinematographer. Often on location, loves vinyl and culinary adventures.',
  '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"]'::jsonb,
  'members', 4
),
(
  '44444444-4444-4444-4444-444444444444',
  'Sora Tanaka', 'they/them',
  'Computational linguist, tea enthusiast, and board game designer.',
  '["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800"]'::jsonb,
  'members', 5
),
(
  '55555555-5555-5555-5555-555555555555',
  'Devon Cruz', 'he/they',
  'Community organizer and sound engineer. Committed to polyamorous networks.',
  '["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800"]'::jsonb,
  'members', 4
),
(
  '66666666-6666-6666-6666-666666666666',
  'Nadia Al-Mansoor', 'she/her',
  'Aerospace materials engineer. Avid runner and ceramicist.',
  '["https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800"]'::jsonb,
  'members', 2
)
ON CONFLICT (user_id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  bio = EXCLUDED.bio,
  photos = EXCLUDED.photos;

-- Insert User Geography
INSERT INTO user_geography (user_id, latitude, longitude, city, max_distance_km, open_to_long_distance) VALUES
('11111111-1111-1111-1111-111111111111', 37.7749, -122.4194, 'San Francisco, CA', 25, false),
('22222222-2222-2222-2222-222222222222', 37.7833, -122.4167, 'San Francisco, CA', 30, false),
('33333333-3333-3333-3333-333333333333', 37.7600, -122.4400, 'San Francisco, CA', 40, false),
('44444444-4444-4444-4444-444444444444', 37.8044, -122.2712, 'Oakland, CA', 50, false),
('55555555-5555-5555-5555-555555555555', 37.7650, -122.4200, 'San Francisco, CA', 25, false),
('66666666-6666-6666-6666-666666666666', 37.7500, -122.4100, 'San Francisco, CA', 30, false)
ON CONFLICT (user_id) DO UPDATE SET
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude;

-- Insert Identity Attribute Values (Elena: Self)
INSERT INTO attribute_values (user_id, attribute_id, value, perm_display, perm_matchable, verified_status) VALUES
('11111111-1111-1111-1111-111111111111', 'relationship_intention', '["Long-Term Partnership / Marriage"]'::jsonb, true, true, 'verified'),
('11111111-1111-1111-1111-111111111111', 'relationship_structure', '"monogamous"'::jsonb, true, true, 'verified'),
('11111111-1111-1111-1111-111111111111', 'diet', '"vegetarian"'::jsonb, true, true, 'verified'),
('11111111-1111-1111-1111-111111111111', 'smoking', '"never"'::jsonb, true, true, 'verified'),
('11111111-1111-1111-1111-111111111111', 'communication_style', '"reflective deliberate"'::jsonb, true, true, 'verified'),
('11111111-1111-1111-1111-111111111111', 'photo_verified', 'true'::jsonb, true, true, 'verified'),

-- Maya: Match
('22222222-2222-2222-2222-222222222222', 'relationship_intention', '["Long-Term Partnership / Marriage"]'::jsonb, true, true, 'verified'),
('22222222-2222-2222-2222-222222222222', 'relationship_structure', '"monogamous"'::jsonb, true, true, 'verified'),
('22222222-2222-2222-2222-222222222222', 'diet', '"vegetarian"'::jsonb, true, true, 'verified'),
('22222222-2222-2222-2222-222222222222', 'smoking', '"never"'::jsonb, true, true, 'verified'),
('22222222-2222-2222-2222-222222222222', 'communication_style', '"reflective deliberate"'::jsonb, true, true, 'verified'),
('22222222-2222-2222-2222-222222222222', 'photo_verified', 'true'::jsonb, true, true, 'verified'),

-- Liam: Smoker (Dealbreaker target)
('33333333-3333-3333-3333-333333333333', 'relationship_intention', '["Committed Relationship"]'::jsonb, true, true, 'verified'),
('33333333-3333-3333-3333-333333333333', 'relationship_structure', '"monogamous"'::jsonb, true, true, 'verified'),
('33333333-3333-3333-3333-333333333333', 'diet', '"omnivore"'::jsonb, true, true, 'verified'),
('33333333-3333-3333-3333-333333333333', 'smoking', '"socially"'::jsonb, true, true, 'verified'),

-- Sora: Omnivore with 70% flexibility
('44444444-4444-4444-4444-444444444444', 'relationship_intention', '["Long-Term Partnership / Marriage"]'::jsonb, true, true, 'verified'),
('44444444-4444-4444-4444-444444444444', 'relationship_structure', '"flexible"'::jsonb, true, true, 'verified'),
('44444444-4444-4444-4444-444444444444', 'diet', '"omnivore"'::jsonb, true, true, 'verified'),
('44444444-4444-4444-4444-444444444444', 'smoking', '"never"'::jsonb, true, true, 'verified'),

-- Devon: Polyamorous (Structure conflict)
('55555555-5555-5555-5555-555555555555', 'relationship_intention', '["Committed Relationship"]'::jsonb, true, true, 'verified'),
('55555555-5555-5555-5555-555555555555', 'relationship_structure', '"polyamorous"'::jsonb, true, true, 'verified'),
('55555555-5555-5555-5555-555555555555', 'smoking', '"never"'::jsonb, true, true, 'verified'),

-- Nadia: Unfilled values (Uncertainty / Missing data test)
('66666666-6666-6666-6666-666666666666', 'relationship_intention', '["Long-Term Partnership / Marriage"]'::jsonb, true, true, 'unverified'),
('66666666-6666-6666-6666-666666666666', 'photo_verified', 'false'::jsonb, true, true, 'unverified')
ON CONFLICT (user_id, attribute_id) DO UPDATE SET
  value = EXCLUDED.value;

-- Elena's Preferences (Dealbreakers & Flexibility)
INSERT INTO preferences (user_id, attribute_id, value, requirement_level, importance, flexibility, dealbreaker) VALUES
-- Hard dealbreaker against smoking
('11111111-1111-1111-1111-111111111111', 'smoking', '["never"]'::jsonb, 'MUST', 5, 0, true),
-- Hard dealbreaker requiring monogamy
('11111111-1111-1111-1111-111111111111', 'relationship_structure', '["monogamous", "flexible"]'::jsonb, 'MUST', 5, 0, true),
-- Dietary preference with 70% flexibility
('11111111-1111-1111-1111-111111111111', 'diet', '["vegetarian", "vegan"]'::jsonb, 'PREFERENCE', 4, 70, false)
ON CONFLICT (user_id, attribute_id) DO UPDATE SET
  value = EXCLUDED.value,
  requirement_level = EXCLUDED.requirement_level,
  flexibility = EXCLUDED.flexibility,
  dealbreaker = EXCLUDED.dealbreaker;
