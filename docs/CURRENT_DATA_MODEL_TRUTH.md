# CHECK — CURRENT DATA MODEL TRUTH
**File Inspected**: `src/types/index.ts` & `server/src/data/dbStore.ts` & `db/migrations/001_initial_schema.sql`
**Status**: Verified Empirical Data Schema
**Epistemic Standard**: `[VERIFIED FACT]`

---

## 1. Primary TypeScript Data Models (`src/types/index.ts`) `[VERIFIED FACT]`

### `UniversalUserProfile`
Monolithic interface containing:
- `id`: `string`
- `completionStage`: `number` (1 to 6)
- `identity`: Name, age, gender, pronouns, bio, photos, verified, ethnicity, cultural background, languages.
- `intention`: Primary intent, relationship structure (monogamous, polyamorous, enm, flexible), flexibility.
- `attractionPreferences`: Numerical weights (1–5) for physical, emotional, intellectual, romantic, sexual, social modalities.
- `family`: Current children, wants children (`definitely_yes`, `leaning_yes`, `open_to_children`, `unsure`, `leaning_no`, `definitely_not`), co-parenting philosophy.
- `lifestyle`: Diet, smoking, alcohol, cannabis, cleanliness standard (1–5), pets, pet allergies.
- `values`: Core values list, religion, religious observance, worldview, political/civic orientation.
- `communication`: Conflict style (`direct_immediate`, `reflective_deliberate`, `space_first`, `diplomatic`), digital cadence, love languages, neurotype.
- `accessibility`: Step-free required, sensory calm required, ASL required, sleep chronotype (`morning_lark`, `intermediate`, `night_owl`).
- `geography`: City name, lat/lng coordinates, max distance km, distance flexibility km, open to relocation, open to long distance.
- `availability`: Work schedule, free hours per week, preferred meeting format.
- `preferences`: Genders sought, ethnicities sought, min/max age, age flexibility years, structure preference, wants children preference, diet preference, smoking preference, weights for values/communication.
- `privacy`: Incognito mode, location fuzzing radius.
- `behaviour`: Response rate %, average response hours, ghosting reports count, handshakes initiated.

---

## 2. Database Schema Alignment (`db/migrations/001_initial_schema.sql`) `[VERIFIED FACT]`

PostgreSQL schema defines tables:
1. `users`: Stores core profile JSONB and completion stage.
2. `store_users`: Dynamic runtime store table for user profiles.
3. `store_encrypted_tier4`: Tier 4 Field-Level Encrypted attributes (`encrypted_payload JSONB`, `perm_matchable`, `perm_display`).
4. `store_blocks`: Bidirectional user block entries (`blocker_id`, `blocked_id`).
5. `store_reports`: Moderation reports (`reporter_id`, `reported_id`, `reason`, `details`, `status`).
6. `store_interactions`: Tracked actions (`interest`, `pass`, `unmatch`).
7. `store_messages`: Direct connection messaging.
8. `store_audit_logs`: WORM audit logging (`actor_id`, `actor_role`, `action`, `target_type`, `target_id`, `detail`).

---

## 3. Structural Gaps vs Specification Requirements `[CURRENT VS TARGET GAP]`

1. **Self-Supply vs Partner-Demand Conflation**: Self-traits ($Y_i$) and partner demands ($X_i$) are stored within the same profile object rather than being decoupled into distinct vectors.
2. **Missing `ObservationState`**: Attributes do not record observation provenance:
   - `observed`
   - `not_observed`
   - `declined`
   - `not_applicable`
3. **Missing Explicit `Confidence` Metadata**: Attributes lack item-level epistemic uncertainty or measurement stability metrics.
4. **Missing Attribute Provenance**: No distinction between self-report, behavioral inference, third-party verification, or temporal observation history.
