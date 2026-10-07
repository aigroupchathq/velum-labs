# CHECK — CONTROLLED MIGRATION PLAN
**Objective**: Evolve Check codebase to match mathematical and UX specifications without breaking working behaviour or conducting a destructive rewrite.
**Status**: Approved Migration Sequence
**Epistemic Standard**: `[DOCUMENTED INTENT]`

---

## Migration Principles
1. **Zero Downtime / Zero-Breakage**: Existing API endpoints and UI features must remain functional throughout all phases.
2. **Phase Gates**: Every phase requires running `npx tsx tools/benchmarkModels.ts` and unit tests to verify 0.0% dealbreaker violations before proceeding.
3. **P0 Security First**: Fix high-risk vulnerabilities (encryption key fallback, session identity, CORS) before refactoring data schemas.

---

## Migration Phase Roadmap

```
 ┌─────────────────────────────────────────────────────────────┐
 │ Phase 0: Security & Environment Hardening (P0 Immediate)   │
 │ - Fail-fast on missing production encryption key           │
 │ - Session-derived user identity middleware                │
 │ - CORS policy tightening                                   │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Phase 1: Data Model Formalization & Decoupling             │
 │ - Decouple Self-Supply (Y_i) from Partner-Demand (X_i)      │
 │ - Introduce ObservationState enum                          │
 │ - Add item-level Confidence metadata                       │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Phase 2: Engine Pipeline Refactoring (Veto -> Penalty)      │
 │ - Extract explicit Veto phase Gamma(Y, X)                  │
 │ - Rebrand compatibility scores from P(Fit) to Ranking R_ij │
 │ - Implement anti-trilateration distance coarsening         │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Phase 3: UX & Human Measurement Layer Alignment             │
 │ - Update question bank with ObservationState handling      │
 │ - Reflect uncertainty & confidence bounds in UI cards      │
 └──────────────────────────────┬──────────────────────────────┘
                                │
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │ Phase 4: Full Validation & Benchmark Confirmation           │
 │ - Re-run empirical benchmark suite                         │
 │ - Verify 0.0% dealbreaker violations & Gini distribution   │
 └─────────────────────────────────────────────────────────────┘
```

---

## Detailed Action Plan

### Phase 0: Security & Environment Hardening (P0)
1. **`server/src/security/encryption.ts`**: Update constructor to throw an error in production if `FIELD_ENCRYPTION_KEY` is not provided.
2. **`server/src/index.ts`**: Configure CORS middleware with origin whitelist.
3. **`server/src/routes/matching.ts`**: Add session identity middleware fallback for development while preventing arbitrary identity impersonation.

### Phase 1: Data Model Formalization
1. Extend `src/types/index.ts` with `SelfSupplyProfile`, `PartnerDemandProfile`, `ObservationState`, and `ItemConfidence`.
2. Provide backward-compatible mapper functions converting `UniversalUserProfile` $\leftrightarrow$ `DecoupledUserProfile`.

### Phase 2: Matching Engine Pipeline Optimization
1. Refactor `src/utils/matchingEngine.ts` to execute pre-flight Veto checks ($\Gamma$) before calculating soft penalties ($\Omega$) and directional utilities ($U_{A \to B}, U_{B \to A}$).
2. Update term labels: `probability` $\to$ `ranking_score`.
3. Add distance coarsening in `geography` evaluation.

### Phase 3 & 4: UX & Verification
1. Update UI components (`MatchCard`, `DeepReportModal`) to display epistemic confidence and score bands.
2. Execute `npx tsx tools/benchmarkModels.ts` to confirm ground-truth performance invariants.
