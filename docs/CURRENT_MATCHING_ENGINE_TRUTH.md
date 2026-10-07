# CHECK — CURRENT MATCHING ENGINE TRUTH
**File Inspected**: `src/utils/matchingEngine.ts` (862 lines)
**Status**: Verified Empirical Architecture
**Epistemic Standard**: `[VERIFIED FACT]` for code logic, `[CURRENT VS TARGET GAP]` for missing formal mechanics.

---

## 1. Engine Pipeline Overview `[VERIFIED FACT]`

The current matching engine (`src/utils/matchingEngine.ts`) implements a **5-Stage Deterministic Pipeline**:

```
[User A, User B]
       │
       ▼
 ┌───────────┐
 │ Sanitize  │ ──► Zero-crash fallback defaults for missing fields
 └─────┬─────┘
       │
       ▼
 ┌───────────┐
 │Contradict │ ──► Preference self-consistency checks
 └─────┬─────┘
       │
       ▼
 ┌───────────┐
 │ Direction │ ──► Evaluate A -> B and B -> A independently
 └─────┬─────┘
       │
       ▼
 ┌───────────┐
 │   Gating  │ ──► Hard dealbreaker filter (Age, Gender, Structure, Kids, Smoking, Geo)
 └─────┬─────┘     If conflicts > 0 => score = 0, eligible = false
       │
       ▼
 ┌───────────┐
 │Aggregating│ ──► Harmonic Mean H(A, B) = 2 * (A * B) / (A + B)
 └───────────┘     Confidence = min(RatioA, RatioB) * VerificationFactor
```

---

## 2. Formal Mathematical Breakdown `[VERIFIED FACT]`

### 2.1 Spatial Distance Formula
Uses the Haversine formula (`calculateHaversineDistance`, lines 16–33):
$$d = 2 R \arcsin \left( \sqrt{ \sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right) } \right)$$
where $R = 6371 \text{ km}$.

### 2.2 Directional Scoring (`evaluateDirection`)
Evaluates 8 distinct dimensions from Evaluator to Target:
1. **Relationship Alignment** ($W=5$): Intent matching & structure acceptance.
2. **Family & Children Alignment** ($W=5$): Children desire compatibility.
3. **Lifestyle & Habits** ($W=4$): Diet, smoking, cleanliness ($|c_A - c_B|$), pet allergies.
4. **Core Values & Philosophy** ($W=4$): Jaccard core value set overlap.
5. **Multi-Modal Attraction** ($W=3$): Normalized dot product across 6 attraction modalities.
6. **Communication & Conflict** ($W=4$): Conflict resolution style alignment.
7. **Geographic Feasibility** ($W=5$): Distance vs `maxDistanceKm` + `distanceFlexibilityKm`.
8. **Temporal Feasibility** ($W=2$): Sleep chronotype alignment (morning lark, night owl, intermediate).

Directional score formula:
$$S_{\text{dir}} = \frac{\sum_{i=1}^{8} \text{Score}_i \times W_i}{\sum_{i=1}^{8} W_i}$$

### 2.3 Dyadic Reciprocal Aggregation (`evaluateMatch`)
Harmonic mean score:
$$\text{MutualScore} = \begin{cases} \left\lfloor \frac{2 \times S_{A \to B} \times S_{B \to A}}{S_{A \to B} + S_{B \to A}} \right\rfloor & \text{if eligible and } S_{A \to B}, S_{B \to A} > 0 \\ 0 & \text{otherwise} \end{cases}$$

### 2.4 Epistemic Confidence Rating
$$\text{Confidence} = \left\lfloor \min\left( \frac{\text{KnownWeight}_A}{\text{TotalWeight}_A}, \frac{\text{KnownWeight}_B}{\text{TotalWeight}_B} \right) \times 100 \times \text{Factor}_{\text{verified}} \right\rfloor$$
where $\text{Factor}_{\text{verified}} = 1.0$ if both profiles are verified, else $0.85$.

---

## 3. Current Engine Limitations vs `CHECK_MATHEMATICAL_THEORY_v1` `[CURRENT VS TARGET GAP]`

1. **Lack of Veto / Penalty Separation**: Currently, hard dealbreakers directly force `eligible = false` inside dimension evaluation instead of operating as a pre-scoring Veto filter $\Gamma$.
2. **Probability Mislabeling**: Compatibility scores are integer percentages $[0, 100]$, not calibrated probabilities $P(\text{Fit}_{ij})$.
3. **Absence of ObservationState**: Missing or un-entered attributes default to fallback values rather than being explicitly tracked as `not_observed`, `declined`, or `not_applicable`.
4. **No Distance Coarsening**: Geolocation uses exact coordinates $(\text{lat}, \text{lng})$ during scoring rather than anti-trilateration coarsening bands.
