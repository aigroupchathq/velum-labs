# CHANGELOG.md

## [Unreleased] — Phase 0

### 2026-10-04 — Section 41 documents v0.2 (revision)
- Rewrote PROJECT, SYSTEM_ARCHITECTURE, ATTRIBUTE_DICTIONARY, MATCHING_SPEC, DATA_MODEL,
  TEST_PLAN, EVALUATION to align with master prompt §4, §5, §7–§19, §21–§29, §36.
- **Removed fabricated content from v0.1:** invented benchmark results table (EVALUATION.md),
  unmeasured latency figures, asserted fairness thresholds, vendor choices made without input,
  and status headers claiming the baseline was accepted.
- MATCHING_SPEC: added comparison of all five mutuality methods; harmonic mean is now marked
  provisional pending simulation.
- ONTOLOGY: marked value lists as drafts; added user model (§6) and the six attraction types (§12);
  listed categories that need a discrimination-risk policy.
- Added ARCHITECTURE_REVIEW.md (proposal, 23 open decisions, contradictions, risks, dependencies).
- No application code changed.

### 2026-10-04 — Section 41 documents v0.1
- Initial drafts (superseded). Commit `15ad5e5` also included pre-existing uncommitted UI and
  prototype-engine changes (`src/App.tsx`, `CardDeck.tsx`, `ProfileDetailModal.tsx`,
  `UserProfileModal.tsx`, `types/index.ts`, `CompatibilityDrawer.tsx`, `matchingEngine.ts`,
  `testMatchingEngine.ts`).
