# PROJECT.md — Universal Compatibility & Relationship-Discovery Platform

> **Status:** DRAFT v0.2 — Phase 0 (Research & Architecture). **Not yet accepted.**
> Open decisions are tracked in [ARCHITECTURE_REVIEW.md](ARCHITECTURE_REVIEW.md). Nothing in this
> repository should be read as an accepted product policy until that review is signed off.

## 1. Objective

Build an **auditable, privacy-conscious, explainable, reciprocal compatibility and
relationship-discovery system** that can eventually *test* — not assume — whether a universal
compatibility ontology produces better outcomes than conventional dating recommendation systems.

The system optimises for **mutual compatibility**, not swipes, engagement, popularity or profile visibility.

Central question the system must answer for any pair (A, B):

> How compatible are they (A→B and B→A)? How mutually compatible? What is unknown? What conflicts
> exist? Why is the recommendation being made?

## 2. Concepts that must never be collapsed

| Concept | Meaning | Where it lives |
| :--- | :--- | :--- |
| IDENTITY | What a person *is* (self-declared) | `attribute_values` (self) |
| INTENTION | What they are seeking now | relationship objective |
| REQUIREMENT | Condition a partner must meet (`MUST`) | `requirements` |
| PREFERENCE | Weighted desire (`STRONG_PREFERENCE`, `PREFERENCE`, `AVOID`) | `preferences` |
| DEALBREAKER | Explicit exclusion flag | `dealbreakers` |
| FLEXIBILITY | 0–100 willingness to compromise on a preference | on each preference |
| ATTRACTION | Physical, emotional, intellectual, romantic, sexual, social | separate dimension |
| COMPATIBILITY | Alignment of one person's criteria with another's attributes | per-dimension scores |
| MUTUALITY | Aggregation of A→B and B→A | MATCHING_SPEC §6 |
| FEASIBILITY | Geographic / temporal practicality | separate dimensions |
| UNCERTAINTY | What is unknown | separate output |
| BEHAVIOUR | Observed in-product actions | `events` |
| OUTCOME | Downstream results (conversation, date, feedback) | outcome pipeline |

The critical distinction (spec §5) — "I am vegetarian" / "I prefer vegetarian partners" /
"I require vegetarian partners" / "I don't care" / "I am willing to compromise" — maps to five
different records (self value, PREFERENCE, MUST, NEUTRAL, flexibility). See DATA_MODEL.md §3.

## 3. Development rules (summary of master prompt §0)

Phased work; no invented requirements; no silent changes to matching logic; stop on ambiguity;
every matching rule documented, deterministic, unit- and integration-tested and explainable;
no ML in the MVP engine; no inference of sensitive characteristics; unknown ≠ incompatible;
no discriminatory rules on protected characteristics; scores are never presented as probability
of relationship success; no fabricated certainty; security and privacy are architectural.

## 4. Current repository state (inspected 2026-10-04)

| Item | State |
| :--- | :--- |
| Stack | React 19, TypeScript ~6.0, Vite 8, Tailwind CSS 4, lucide-react, canvas-confetti, oxlint |
| Backend / database | **None.** All data is client-side mock data (`src/data/mockProfiles.ts`) |
| UI | A **Tinder-style swipe clone** (card deck, like/nope/superlike, "Likes You", Gold-style upsell, chat, match celebration) |
| Matching | `src/utils/matchingEngine.ts` — a prototype covering 6 attributes; see ARCHITECTURE_REVIEW.md §3 for defects against this spec |
| Tests | `src/utils/testMatchingEngine.ts` — an ad-hoc script (8 scenarios); no test runner, no CI |

The existing UI paradigm contradicts the product objective (swipe/engagement mechanics). How to
treat it is an open decision (ARCHITECTURE_REVIEW.md, D-01).

## 5. Phases (master prompt §38)

0 Research & architecture **(current)** · 1 Ontology & data model · 2 Auth & user profile ·
3 Preference/constraint engine · 4 Deterministic compatibility engine · 5 Mutual matching ·
6 Recommendation engine · 7 Explanation engine · 8 Messaging & interaction tracking ·
9 Synthetic population & evaluation · 10 Privacy/security/safety hardening ·
11 Payments/subscriptions · 12 Production infrastructure · 13 Controlled beta ·
14 Real-world experimentation · 15 Only then investigate ML.

Each phase follows the agent operating protocol (§39): read docs → inspect code → identify
affected components → state assumptions → smallest correct change → tests → regression →
docs → report.

## 6. Documentation set

| Document | Status |
| :--- | :--- |
| PROJECT.md, SYSTEM_ARCHITECTURE.md, ONTOLOGY.md, ATTRIBUTE_DICTIONARY.md, MATCHING_SPEC.md, DATA_MODEL.md, TEST_PLAN.md, EVALUATION.md | Draft v0.2 (Section 41) |
| ARCHITECTURE_REVIEW.md | Draft — architecture proposal, missing decisions, contradictions, risks, dependencies |
| CHANGELOG.md | Active |
| PRODUCT_REQUIREMENTS.md, SCORING_SPEC.md, API_SPEC.md, SECURITY_SPEC.md, PRIVACY_SPEC.md, SAFETY_SPEC.md, EXPERIMENT_PLAN.md, RESEARCH_DATABASE.md | **Not yet created** — required by §2 before substantial implementation; scheduled after baseline acceptance |
