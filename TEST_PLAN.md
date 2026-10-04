# TEST_PLAN.md

> **Status:** DRAFT v0.2 — not accepted. **Current reality:** the repo has no test runner and no
> CI. The only tests are an ad-hoc script (`src/utils/testMatchingEngine.ts`, 8 scenarios run via
> `npx tsx`) against the prototype engine, which will be replaced in Phase 4.

## 1. Tooling (proposed, [OPEN D-18])

| Need | Proposal |
| :--- | :--- |
| Unit / integration runner | Vitest (same toolchain as Vite) |
| Property-based tests | fast-check |
| Database tests | Postgres in a container, migrations applied per run |
| API tests | runner against the API service once it exists |
| End-to-end | Playwright |
| Security | dependency audit, lint rules, authz test matrix, OWASP-style checks on API |
| CI | provider not specified → open |

## 2. Testing levels per subsystem (spec §36)

Every subsystem: unit, integration, API, database, end-to-end, security, property-based.
Matching engine additionally: mathematical invariant, synthetic population, fairness, regression
(golden-file outputs pinned to `ruleset_version`).

## 3. Matching test catalogue (spec §26)

| Area | Example cases |
| :--- | :--- |
| Hard conflicts | `wants_children` MUST definitely vs definitely not → ineligible (both directions) |
| Soft conflicts | PREFERENCE mismatch lowers score, stays eligible |
| Unknowns | B religion UNKNOWN → religion criterion UNKNOWN, not 0; uncertainty lists it |
| Missing data | profile with only required fields → eligible, compatibility `null` or partial, LOW confidence |
| Mutuality | (95, 25) never labelled strong; `asymmetric = true`; all five methods computed in harness |
| Flexibility | importance 4, flexibility 70, no dealbreaker → never excluded (spec §13 example) |
| Contradictions | distance NEUTRAL + max 10 km → `PREFERENCE_CONTRADICTION` (spec §14 example) |
| Edge cases | identical users, empty preference sets, all-NEUTRAL user, everything MUST |
| Duplicate attributes | two preference rows for one attribute rejected by constraint |
| Invalid values | value outside `allowed_values` rejected at write; engine never sees it |
| Privacy restrictions | `perm_matchable = false` → engine treats as UNKNOWN; explanation does not leak it |
| Blocked users | either-direction block → never in candidates |
| Age restrictions | under-18 never stored as active; age range MUST gates |
| Distance | hard limit both directions; boundary values (= limit) |
| Time zones | temporal feasibility across offsets, DST boundaries |
| Relationship structures | monogamous vs polyamorous combinations, MUST vs PREFERENCE |
| Same-sex matching | mutual gender/orientation eligibility for all combinations, including non-binary |
| Multi-person structures | **[OPEN D-19]** engine is dyadic; tests define expected dyadic behaviour only |
| Religious requirements | MUST same religion; practice-level preference with flexibility |
| Children | has/wants combinations |
| Accessibility | needs vs feasibility (pending D-06) |
| Communication, lifestyle, values | dimension scores in range, correct contributors |

## 4. Property-based invariants (spec §27, MATCHING_SPEC §11)

Run with generated profiles (minimum 10,000 cases per property in CI):
non-matchable attribute changes never alter scores · dealbreaker false→true never adds eligibility ·
known→UNKNOWN never removes eligibility nor yields 0 · blocked never recommended · never
self-recommended · ineligible never recommended · mutuality symmetric · bounds respected ·
deterministic · payment state never affects scores.

## 5. Synthetic population tests (spec §25)

Generator produces 10 / 100 / 1,000 / 10,000 / 100,000 / 1,000,000 users (largest sizes as far as
computationally feasible; feasibility to be measured, not assumed). Required strata: common
profiles, rare profiles, contradictory profiles, extreme preferences, missing information,
highly constrained, highly flexible, imbalanced populations (e.g. gender ratios, rare
orientations). Generator is seeded and reproducible.

**Caveat:** synthetic distributions are invented; tests check correctness and robustness, not
real-world behaviour.

## 6. Fairness tests (spec §18)

Measure — not assert — exposure distribution, match opportunity, mutual-match rate, false-negative
rate, popularity concentration (e.g. Gini of exposure) and candidate coverage, broken down by
strata. Thresholds that fail CI are **[OPEN D-20]**; none are set without a decision. Protected
characteristics are used only to *measure* disparities, never as ranking inputs.

## 7. Existing prototype

The 8 current scenarios document intended behaviour (hard exclusion, flexibility, unknowns,
mutuality, conflicts, confidence). They will be ported as regression cases where they agree with
MATCHING_SPEC and **rewritten** where they rely on prototype defects (e.g. default values injected
for missing user data).
