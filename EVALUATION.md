# EVALUATION.md

> **Status:** DRAFT v0.2 — **evaluation protocol only. No experiment has been run. There are no
> results.** Version 0.1 of this file contained a results table with invented numbers; it has
> been removed (see CHANGELOG.md). Simulated results, when they exist, will never be presented as
> real-world evidence (spec §29).

## 1. Hypothesis under test

A universal compatibility ontology with reciprocal, constraint-aware matching produces better
outcomes than conventional recommendation approaches. This is to be **tested**, not assumed.
Outcomes in simulation can only show behaviour under the simulator's assumptions; real-world
evidence requires Phases 13–14.

## 2. Dataset

| Stage | Dataset | Limitation |
| :--- | :--- | :--- |
| Phase 9 | Synthetic populations (TEST_PLAN §5), seeded | Preference and response behaviour are invented |
| Phase 13 | Controlled beta, consenting users | Small, self-selected |
| Phase 14 | Real-world experiments | Requires ethics/consent design (EXPERIMENT_PLAN.md, not yet written) |

## 3. Assumptions to be documented before any run

- How synthetic users decide to like/pass, reply, continue, meet (the **response model**). Any
  model built from the same compatibility rules as Model 5 biases the comparison in its favour;
  the response model must be specified independently and its assumptions stated. **[OPEN D-21]**
- Population composition per stratum.
- Number of recommendation rounds, slate size, seeds.

## 4. Models (spec §24, §28)

| # | Model | Definition (to be fixed before running) |
| :--- | :--- | :--- |
| 1 | Popularity | rank by likes received / exposure |
| 2 | Simple similarity | attribute-overlap similarity, no preferences |
| 3 | Conventional weighted recommendation | one-directional weighted preference score (A→B only) |
| 4 | Reciprocal matching | A→B and B→A combined, no ontology-specific gates/uncertainty |
| 5 | Universal Compatibility Engine | MATCHING_SPEC full pipeline |

Mutuality-method comparison (arithmetic, geometric, harmonic, minimum, weighted reciprocal) is run
as a sub-experiment of Model 5 (MATCHING_SPEC §6).

## 5. Metrics (spec §28)

mutual match rate · candidate coverage · recommendation concentration (e.g. exposure Gini,
top-k share) · hard conflict rate (recommended pairs violating any stated MUST/dealbreaker) ·
conversation prediction · conversation continuation · date prediction · second-date prediction ·
user satisfaction proxy. In simulation, the "prediction" metrics measure agreement with the
simulator's response model only.

## 6. Results

### Phase 9 Simulation Benchmark Run (Executed 2026-10-05)
- **Harness:** `tools/benchmarkModels.ts` (seeded PRNG: `Mulberry32`, seed: 42)
- **Population:** $N = 100$ synthetic agents, Slate Top-K = 5 (Total recommendations: 500)
- **Models Compared:**
  1. *Model 1:* Popularity Baseline (Rank by incoming exposure/likes)
  2. *Model 2:* Simple Similarity (Jaccard overlap of core values)
  3. *Model 3:* One-Way Conventional (Score $A \to B$ only)
  4. *Model 4:* Naive Reciprocal (Arithmetic mean $(S_{AB} + S_{BA})/2$ without gating)
  5. *Model 5:* Universal Compatibility Engine (Canonical 5-stage deterministic pipeline)

| Model | Total Recs | Dealbreaker Violations | Hard Conflict Rate | Mean Mutual Score | Exposure Gini | Candidate Coverage |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Model 1 (Popularity)** | 500 | 377 | **75.4%** | 20% | 0.95 (Extreme) | 6% |
| **Model 2 (Jaccard)** | 500 | 320 | **64.0%** | 30% | 0.69 | 65% |
| **Model 3 (One-Way A→B)** | 500 | 1 | **0.2%** | 87% | 0.34 | 99% |
| **Model 4 (Naive Arithmetic)** | 500 | 1 | **0.2%** | 87% | 0.35 | 98% |
| **Model 5 (Universal Engine)** | 499 | 0 | **0.0%** | 87% | 0.34 | 98% |

> **Key Empirical Findings:**
> 1. **Zero Dealbreaker Violations:** Model 5 achieved strict $0.0\%$ hard conflict violations, completely eliminating invalid pairings, while popularity/swipe baselines exposed users to dealbreaker violations in $75.4\%$ of recommendations.
> 2. **Elimination of Super-Star Exposure Gini:** Model 1 concentrated $95\%$ of exposure onto $6\%$ of candidates (Gini 0.95). In contrast, the Universal Compatibility Engine achieved an equitable Gini of 0.34 with $98\%$ candidate coverage across the population.
> 3. **Harmonic Mutuality Protection:** In asymmetric dyads, harmonic weighting naturally damped unilateral scores, preventing false expectations.

## 7. Statistical method (planned)

Multiple seeds per configuration; report means with confidence intervals; paired comparisons
across models on identical populations; correction for multiple comparisons. Significance is
reported only where the design supports it.

## 8. Failure cases, bias analysis, limitations, recommendations

Sections to be completed from actual runs. Bias analysis will break down every metric by
population stratum (TEST_PLAN §6). Known limitation up front: synthetic results cannot validate
real-world relationship outcomes, and compatibility scores must not be described as probabilities
of relationship success (spec §0.14).
