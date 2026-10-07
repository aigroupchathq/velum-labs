# CHECK — REPOSITORY TRUTH BASELINE AUDIT
**Date**: October 7, 2026
**Status**: Verified Empirical Reality (Post Toolchain Restoration)
**Epistemic Standard**: Strict Evidence-First Classification (`[VERIFIED FACT]`, `[DOCUMENTED INTENT]`, `[INFERENCE]`, `[UNVERIFIED]`, `[ABSENT]`)

---

## 1. Executive Summary & Audit Scope

This document establishes the empirical baseline truth of the **Check / Universal Compatibility Engine** repository following toolchain recovery verification (`TOOLCHAIN RESTORED: YES`). Every assertion in this document is derived directly from inspected source files.

---

## 2. Directory Structure & File Map `[VERIFIED FACT]`

```text
/
├── API_SPEC.md                            # Documented intent for API endpoints
├── ARCHITECTURE_REVIEW.md                  # System architecture design & compliance review
├── ATTRIBUTE_DICTIONARY.md                # Dictionary of matching attributes & domains
├── CHANGELOG.md                           # Project revision log
├── DATA_MODEL.md                          # Data schema & domain model specifications
├── EVALUATION.md                          # Evaluation methodology & model comparisons
├── EXPERIMENT_PLAN.md                     # Empirical validation & test plans
├── MATCHING_SPEC.md                       # Formal matching algorithm specification
├── ONTOLOGY.md                            # Domain ontology definitions
├── PRIVACY_SPEC.md                        # Privacy & Field-Level Encryption spec
├── PRODUCT_REQUIREMENTS.md                # Product requirement specifications
├── PROJECT.md                             # High-level project summary
├── README.md                              # Repository overview & setup instructions
├── RESEARCH_DATABASE.md                   # Research backing compatibility models
├── SAFETY_SPEC.md                         # User safety, blocking & reporting spec
├── SCORING_SPEC.md                        # Dimension scoring specifications
├── SECURITY_SPEC.md                       # Security & encryption specifications
├── SYSTEM_ARCHITECTURE.md                 # System architecture overview
├── TEST_PLAN.md                           # Verification & test suite plan
├── db/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql         # SQL schema definition for PostgreSQL
│   │   ├── 002_seed_attributes.sql        # Seed scripts for matching attributes
│   │   └── 003_seed_canonical_profiles.sql# Canonical profile seeds
│   └── validateMigrations.ts              # Migration validation runner
├── package.json                           # Dependencies & scripts
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── server/
│   ├── src/
│   │   ├── data/
│   │   │   └── dbStore.ts                 # Dual-mode DB store (In-memory + PostgreSQL)
│   │   ├── db/
│   │   │   └── postgresPool.ts            # PostgreSQL pg.Pool connection manager
│   │   ├── routes/
│   │   │   ├── beta.ts                    # Beta cohort & invite routes
│   │   │   ├── matching.ts                # Recommendation & pair evaluation endpoints
│   │   │   ├── preferences.ts             # User preference CRUD routes
│   │   │   ├── privacy.ts                 # Privacy & Tier 4 encryption routes
│   │   │   ├── profile.ts                 # Profile management routes
│   │   │   ├── safety.ts                  # Block & report safety routes
│   │   │   └── subscriptions.ts           # Monetization & tier routes
│   │   ├── scaling/
│   │   │   └── slateManager.ts            # Spatial grid & recommendation slate manager
│   │   ├── security/
│   │   │   └── encryption.ts              # Field-Level Encryption (AES-256-GCM)
│   │   ├── workers/
│   │   │   └── matchPool.ts               # Node worker_threads match worker pool
│   │   ├── index.ts                       # Express app entry point
│   │   └── testApi.ts                     # API test script
├── src/
│   ├── App.css
│   ├── App.tsx                            # Primary UI React application shell
│   ├── assets/
│   ├── components/
│   │   ├── ContradictionsBanner.tsx       # Contradiction warning banner
│   │   ├── DeepReportModal.tsx            # Explainability breakdown modal
│   │   ├── MatchCard.tsx                  # Candidate recommendation card UI
│   │   ├── Navbar.tsx                     # Top nav bar
│   │   ├── PairEvaluatorView.tsx          # Interactive pair evaluation tool
│   │   ├── PreferenceOptimizerView.tsx    # Preference editing view
│   │   └── ProgressiveDisclosureModal.tsx # Privacy disclosure modal
│   ├── data/
│   │   └── mockProfiles.ts                # Canonical test profile fixtures
│   ├── index.css
│   ├── main.tsx                           # React DOM mount point
│   ├── types/
│   │   └── index.ts                       # TypeScript domain interfaces
│   └── utils/
│       ├── matchingEngine.ts              # Core 5-stage deterministic matching engine
│       ├── sound.ts                       # UI audio feedback utility
│       └── testMatchingEngine.ts          # Engine unit test runner
└── tools/
    ├── benchmarkModels.ts                 # 5-model empirical benchmark suite
    └── syntheticPopulation.ts             # Deterministic Mulberry32 synthetic generator
```

---

## 3. Toolchain & Environment Baseline `[VERIFIED FACT]`

- **Runtime**: Node.js (ESM modules via TypeScript `NodeNext`/`Node16` resolution)
- **Framework**: Express 5.0.1 (Server), React 19.0.0 (Client), Vite 6.2.0 (Bundler)
- **Styling**: Tailwind CSS 4.0.9, Lucide React 1.16.0 icons
- **Database**: PostgreSQL (`pg` 8.13.3) with in-memory fallback map cache in `dbStore.ts`
- **Linting**: Oxlint 0.15.11 (`.oxlintrc.json`)

---

## 4. Operational & Architectural Capabilities `[VERIFIED FACT]`

1. **Dual DB Architecture**: `server/src/data/dbStore.ts` attempts to connect to PostgreSQL via `pg.Pool`. If connection fails or is unconfigured, it degrades gracefully to in-memory `Map` storage initialized with `canonicalUsers`.
2. **Worker Pool Concurrency**: `server/src/workers/matchPool.js` offloads heavy $O(N)$ candidate evaluations across Node.js worker threads to maintain low event-loop latency on the main process.
3. **Spatial Grid Pre-indexing**: `server/src/scaling/slateManager.ts` partitions users into spatial bounding grid bins (~15km) to prune distance checks before running matching.
4. **Field Encryption**: `server/src/security/encryption.ts` implements AES-256-GCM encryption with 96-bit IVs and 128-bit authentication tags for Tier 4 attributes.

---

## 5. Security Baseline & Vulnerabilities `[VERIFIED FACT]`

- **P0-1: Encryption Key Fallback Vulnerability**: `server/src/security/encryption.ts` (line 33) uses a static hardcoded fallback string (`'universal_compatibility_tier4_dek_salt_2026'`) hashed via SHA-256 when `FIELD_ENCRYPTION_KEY` is not present in the environment.
- **P0-2: Missing Authentication / IDOR**: `server/src/routes/matching.ts` accepts `userId`, `userAId`, and `userBId` directly from query/body parameters without validating session context or bearer tokens.
- **P0-3: Permissive CORS Configuration**: `server/src/index.ts` (line 29) uses `app.use(cors())` without setting restricted origins or credentials rules.
