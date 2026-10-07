# CHECK — COMPONENT CLASSIFICATION (KEEP / REFACTOR / REPLACE / REMOVE)
**Date**: October 7, 2026
**Status**: Verified Architectural Classification
**Epistemic Standard**: `[VERIFIED FACT]` for code existence, `[DOCUMENTED INTENT]` for target state mapping.

---

## 1. Summary Classification Matrix

| Component | Status | Rationale | Dependencies |
| :--- | :--- | :--- | :--- |
| `server/src/workers/matchPool.ts` | **KEEP** | Non-blocking worker pool architecture functions cleanly for offloading $O(N)$ matching computations. | Node.js `worker_threads` |
| `server/src/scaling/slateManager.ts` | **KEEP** | Spatial grid indexing and caching layer work effectively for scaling. | In-memory spatial index |
| `tools/syntheticPopulation.ts` | **KEEP** | Deterministic Mulberry32 synthetic population generator provides reproducible benchmarks. | None |
| `tools/benchmarkModels.ts` | **KEEP** | Multi-model benchmark suite effectively verifies 0.0% dealbreaker violations for Model 5. | `syntheticPopulation.ts`, `matchingEngine.ts` |
| `server/src/security/encryption.ts` | **REFACTOR** | Core AES-256-GCM cipher logic is sound, but requires removing the hardcoded fallback key in production (P0-1). | Node `crypto` |
| `server/src/routes/matching.ts` | **REFACTOR** | Handlers work but lack session-derived identity verification (P0-2 IDOR risk). | `dbStore.ts`, `matchPool.ts` |
| `src/utils/matchingEngine.ts` | **REFACTOR** | Core 5-stage engine is solid, but needs formal Veto ($\Gamma$) / Penalty ($\Omega$) decoupling and score probability rebranding. | `types/index.ts` |
| `src/types/index.ts` | **REFACTOR** | `UniversalUserProfile` needs decoupling into self-supply ($Y_i$) vs partner-demand ($X_i$), plus `ObservationState` and `Confidence`. | UI components |
| `server/src/index.ts` | **REFACTOR** | Server setup is functional, but CORS policy needs tightening (P0-3). | Express routers |
| `src/components/*` | **REFACTOR** | Front-end React views require updating to reflect decoupled data models and UX theory. | `types/index.ts` |
| Direct coordinate leakage in API | **REPLACE** | Coarsen lat/lng coordinates into discrete distance bands or fuzzed location ranges (P-02). | `matching.ts`, `slateManager.ts` |
| Monolithic profile state | **REPLACE** | Replace single profile struct with explicit `SelfState`, `DemandState`, and `ObservationState`. | `types/index.ts` |
| Unused mock scripts / temporary stubs | **REMOVE** | Legacy unreferenced mock scripts that do not conform to current specs. | None |
