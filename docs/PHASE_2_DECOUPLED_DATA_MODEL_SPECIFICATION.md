# CHECK — PHASE 2 DECOUPLED DATA MODEL & PRIVACY COARSENING SPECIFICATION
**Date**: October 9, 2026
**Status**: Phase 2 Implementation Complete & Verified
**Target Schema**: `DecoupledUserProfile` ($Y_i$ Self-Supply vs $X_i$ Partner-Demand)
**Privacy Standard**: Distance Coarsening Bands & Anti-Trilateration Fuzzing (Privacy P-02)

---

## 1. Executive Summary

Phase 2 formalizes the mathematical data model of the **Check Engine** by explicitly decoupling what a user supplies/presents ($Y_i$) from what they demand in a target partner ($X_i$). This addresses the structural deficit identified in `CURRENT_DATA_MODEL_TRUTH.md` and aligns the codebase with `CHECK_MATHEMATICAL_THEORY_v1`.

In addition, Phase 2 implements anti-trilateration geographic distance coarsening (`coarsenDistanceKm`) and coordinate fuzzing (`fuzzCoordinates`) to guarantee raw GPS coordinates are never leaked to client endpoints.

---

## 2. Decoupled Data Model Architecture (`src/types/index.ts`)

```
                        UniversalUserProfile
                                 │
              ┌──────────────────┴──────────────────┐
              ▼                                     ▼
     SelfSupplyProfile (Y_i)               PartnerDemandProfile (X_i)
   ┌───────────────────────┐             ┌───────────────────────────┐
   │ - Identity & Bio      │             │ - AttractionPreferences   │
   │ - Lifestyle & Diet    │             │ - Hard Constraints (\Gamma)│
   │ - Family Stance       │             │ - Diet/Smoking Preference │
   │ - Core Values         │             │ - Structure Acceptability │
   │ - Conflict Style      │             │ - Values Weight Importance│
   │ - Spatial Coordinates │             └───────────────────────────┘
   └───────────────────────┘
```

### 2.1 ObservationState & Epistemic Measurement
Attributes support explicit observation state tagging:
$$\text{ObservationState} \in \{\text{observed}, \text{not\_observed}, \text{declined}, \text{not\_applicable}\}$$
Measurement confidence ($C_{ij} \in [0, 1]$) and provenance source (`self_report`, `behavioral_inference`, `third_party_verified`) are attached to individual observations to prevent missing data from defaulting to artificial compatibility penalties.

---

## 3. Anti-Trilateration Privacy Coarsening (Privacy P-02)

To prevent location trilateration attacks, exact Haversine distances are mapped into discrete geographic bands via `coarsenDistanceKm`:

| Raw Haversine Distance ($d$) | Coarsened Privacy Band | Client Display |
| :--- | :--- | :--- |
| $d < 5 \text{ km}$ | `< 5 km` | Proximate (< 5 km) |
| $5 \text{ km} \le d < 15 \text{ km}$ | `5–15 km` | Nearby (5–15 km) |
| $15 \text{ km} \le d < 30 \text{ km}$ | `15–30 km` | Metro Area (15–30 km) |
| $30 \text{ km} \le d < 50 \text{ km}$ | `30–50 km` | Regional (30–50 km) |
| $d \ge 50 \text{ km}$ | `50+ km` | Extended Radius (50+ km) |

---

## 4. Verification & Regression Parity

- **Golden Master Parity**: `test/verifyGoldenMaster.ts` verified **100% mathematical parity** across all 11 frozen test cases.
- **Empirical Benchmark**: `tools/benchmarkModels.ts` verified **0.0% hard conflict violations** for Model 5 ($N=100$).
- **Decoupled Model Suite**: `test/phase2DecoupledModel.test.ts` verified 100% loss-less round-trip conversion ($Y_i, X_i \leftrightarrow \text{UniversalUserProfile}$).
- **Oxlint Audit**: 0 warnings, 0 errors across 69 source files.
