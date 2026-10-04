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

**None.** To be filled only from executed, reproducible runs (code commit, seed, config recorded).

## 7. Statistical method (planned)

Multiple seeds per configuration; report means with confidence intervals; paired comparisons
across models on identical populations; correction for multiple comparisons. Significance is
reported only where the design supports it.

## 8. Failure cases, bias analysis, limitations, recommendations

Sections to be completed from actual runs. Bias analysis will break down every metric by
population stratum (TEST_PLAN §6). Known limitation up front: synthetic results cannot validate
real-world relationship outcomes, and compatibility scores must not be described as probabilities
of relationship success (spec §0.14).
