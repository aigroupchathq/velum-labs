# CHECK — GOLDEN MASTER BASELINE DOCUMENTATION
**Date**: October 7, 2026
**Status**: Frozen Regression Baseline Lock (Gate 1 & Gate 6)
**Fixture Storage**: `test/fixtures/goldenMasterFixtures.json`
**Test Runner**: `test/verifyGoldenMaster.ts`

---

## 1. Overview & Purpose

This document establishes the frozen baseline matching behavior of the legacy engine (`src/utils/matchingEngine.ts`) prior to any refactoring. In accordance with Gate 1 guidelines, these 11 test cases capture the empirical output of the legacy engine without manual theoretical adjustments.

---

## 2. Frozen Test Fixture Inventory

| Fixture ID | User A | User B | Expected `isEligible` | Directional $A \to B / B \to A$ | Harmonic Score | Facet Breakdown Highlights |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `clearly_eligible` | Elena | Maya Lin | `true` | 100 / 99 | 99 | Rel: 100, Fam: 100, Life: 98, Val: 100, Geo: 99 |
| `smoking_dealbreaker` | Elena | Liam Vance | `false` | 0 / 0 | 0 | Hard conflict: Elena's non-smoker MUST dealbreaker |
| `children_intention_conflict` | Elena | No Kids User | `false` | 0 / 0 | 0 | Hard conflict: Elena wants kids vs definite no |
| `structure_conflict` | Elena | Devon Towers | `false` | 0 / 0 | 0 | Hard conflict: Monogamous MUST vs Polyamorous |
| `high_reciprocal_score` | Elena | Synthetic #1 | `true` | 89 / 92 | 90 | High mutual alignment across lifestyle & values |
| `highly_asymmetric_score` | Asym User A | Asym User B | `false` | 92 / 0 | 0 | User B has strict vegan MUST dealbreaker against User A |
| `low_score_eligible` | Elena | Synthetic #6 | `true` | 64 / 62 | 63 | Low alignment but zero hard dealbreakers |
| `max_distance_boundary` | Elena | Far User (~65km) | `true` | 74 / 78 | 76 | Within max distance boundary ($70 \text{ km}$) |
| `sparse_profile` | Elena | Nadia Vasquez | `true` | 89 / 90 | 89 | Missing values calibrated confidence score ($85\%$) |
| `identical_profiles` | Elena | Elena | `true` | 100 / 100 | 100 | Perfect self-matching baseline |
| `contradictory_profile` | Elena | Contradictory User | `true` | 96 / 94 | 95 | Surfaced 2 internal preference contradictions |

---

## 3. Parity Invariant Specification

Running `cmd /c npx tsx test/verifyGoldenMaster.ts` executes a 100% field-by-field assertion against `goldenMasterFixtures.json`.

```text
MATCHING_BEHAVIOUR_BEFORE = MATCHING_BEHAVIOUR_AFTER
```

Every security patch must maintain complete 100% parity across all 11 fixtures.
