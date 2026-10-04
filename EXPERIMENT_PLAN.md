# EXPERIMENT_PLAN.md — Controlled Benchmarking & Scientific Evaluation Plan

**Document Version:** 1.0.0  
**Status:** Experimental Methodology Protocol  
**Governing Standard:** Master Build Specification §24, §25, §28, §29  

---

## 1. Scientific Objective & Hypothesis Formulation

**Primary Hypothesis ($H_1$):** A deterministic, bidirectional matching architecture enforcing hard dealbreaker gating, missing-information neutrality, and harmonic mutuality produces significantly higher mutual match conversion, lower conversation ghosting, and equitable exposure distribution ($Gini \le 0.40$) compared to popularity-optimizing swipe algorithms and unstructured similarity recommenders.

**Null Hypothesis ($H_0$):** There is no statistically significant difference in mutual conversion or candidate coverage between popularity/vector recommenders and the Universal Compatibility Engine under controlled synthetic populations.

---

## 2. Benchmark Recommendation Models Under Test

The experiment tests five distinct algorithmic models on identical synthetic cohorts:

```
[ Model 1: Popularity Maximizer ]
  - Proxy for conventional swipe apps (Tinder / Bumble ELO).
  - Ranks candidates by global inbound like counts / attractiveness scores.
  - Objective function: Maximize app open rate and swipe velocity.

[ Model 2: Simple Similarity Recommender ]
  - Computes unweighted cosine similarity over tag embeddings.
  - Ignores explicit directionality, dealbreakers, and personal weights.

[ Model 3: Unilateral Weighted Recommender ]
  - Evaluates detailed preferences unidirectionally (A -> B only).
  - Assumes Candidate B's reciprocal desire is inconsequential.

[ Model 4: Reciprocal Linear Recommender ]
  - Evaluates both A -> B and B -> A, but aggregates using Arithmetic Mean: (A + B) / 2.
  - Lacks hard dealbreaker gating and missing-information normalization.

[ Model 5: Universal Compatibility Engine (UMCE) ]
  - Full 5-stage deterministic pipeline:
    1. Inverted Boolean eligibility & hard dealbreaker gating.
    2. Directional compatibility with unknown-attribute normalization.
    3. Harmonic Mean mutuality aggregation: 2*(A*B)/(A+B).
    4. Epistemic Confidence calibration.
    5. Deterministic explainability.
```

---

## 3. Synthetic Cohort Generation & Environmental Setup

1. **Cohort Scalability Tiers (Spec §25):**
   - Micro ($N = 100$)
   - Small ($N = 1,000$)
   - Medium ($N = 10,000$)
   - Large ($N = 100,000$)
   - Stress-Scale ($N = 1,000,000$, executed where computationally feasible).
2. **Stratified Archetype Distribution:**
   - 60% Common population (balanced preferences, typical regional distributions).
   - 15% Highly constrained / strict dealbreaker profiles (strict dietary, orthodox faith, specific custody).
   - 10% Neurodivergent and sensory-sensitive cohorts.
   - 10% Queer, non-binary, and non-traditional relationship structures (ENM, polyamorous).
   - 5% Contradictory, missing-data, or extreme-flexibility edge profiles.
3. **Random Seed Reproducibility:** Every run is seeded with an explicit integer seed (`SEED = 42, 1337, 2026`) allowing bit-for-bit regression replication.

---

## 4. Evaluated Metrics & Statistical Verification

For each model, the benchmark harness tracks:
1. **Mutual Match Conversion Rate (MMCR):** Percentage of presented pairs where both parties would accept the connection.
2. **Hard Conflict Exposure Rate (HCER):** Percentage of recommended matches that violate an active hard dealbreaker for either party.
3. **Impression Gini Coefficient ($G$):** Measure of exposure inequality ($0 = \text{perfect equality}, 1 = \text{single user monopolisation}$).
4. **Candidate Pool Coverage:** Proportion of registered active candidates who receive at least 5 recommendation exposures per week.
5. **Minority Group Opportunity Parity:** Ratio of exposure and match opportunities received by minority cohorts compared to the global median.

### Statistical Rigor
- Every experiment executes across 20 randomized seeds.
- Metric distributions report mean, median, standard deviation, and 95% bootstrap confidence intervals.
- Differences between models are validated using two-tailed Wilcoxon signed-rank tests with Bonferroni correction for multiple hypothesis testing ($p < 0.001$).
