# CHECK — CURRENT VS TARGET GAP ANALYSIS
**Referenced Specifications**:
- `CHECK_MATHEMATICAL_THEORY_v1`
- `CHECK_HUMAN_MEASUREMENT_AND_UX_THEORY_v1`
**Status**: Comprehensive Gap Analysis
**Epistemic Standard**: `[CURRENT VS TARGET GAP]`

---

## 1. Mathematical Formalism Gaps

### 1.1 Ablation Equation & Loss Formulation
- **Target Spec**: Optimization must be formulated as loss minimization:
$$\mathcal{A}^* = \arg\min_{\mathcal{A} \in \mathcal{F}} \mathbb{E}[\mathcal{L}(Y, \hat{Y}_{\mathcal{A}})]$$
or performance maximization over utility function $Q$.
- **Current Engine**: Ablation is implicitly executed in benchmark scripts without formal loss function tracking.

### 1.2 Bounded Ranking Score vs Calibrated Probability
- **Target Spec**: Bounded score $M_{ij} \in [0, 1]$ must be explicitly referred to as a **compatibility / ranking score** ($R_{ij} = M_{ij}$) rather than a calibrated probability $P(\text{Fit}_{ij})$.
- **Current Engine**: UI and comments sometimes refer to mutual score as "Probability of Compatibility". Must be renamed to `Compatibility Score` or `Ranking Fit`.

### 1.3 Veto ($\Gamma$) vs Soft Penalty ($\Omega$) Decoupling
- **Target Spec**: Hard constraints $\Gamma$ must act as a strict binary gate before soft penalties $\Omega$ and directional utility $U$ are computed:
$$\text{Eligible}(i, j) = \mathbb{I}(\Gamma_i(Y_j) = 1 \land \Gamma_j(Y_i) = 1)$$
- **Current Engine**: Hard conflicts are evaluated inline alongside dimension scores in `evaluateDirection`. Must be separated into a pre-flight Veto phase.

---

## 2. Data Model & Epistemic Measurement Gaps

### 2.1 Decoupling Self-Supply ($Y_i$) and Partner-Demand ($X_i$)
- **Target Spec**: User state must separate what a user presents/supplies ($Y_i$) from what they demand/seek in a partner ($X_i$).
- **Current Engine**: Mixed together inside `UniversalUserProfile`.

### 2.2 ObservationState Framework
- **Target Spec**: Every measured item must track explicit observation state:
$$\text{ObservationState} \in \{\text{observed}, \text{not\_observed}, \text{declined}, \text{not\_applicable}\}$$
- **Current Engine**: Missing attributes fall back to default values in `sanitizeProfile`.

### 2.3 Uncertainty & Confidence ($C_{ij}$)
- **Target Spec**: Epistemic uncertainty must be tracked separately from missingness, incorporating item reliability and response stability.
- **Current Engine**: Simple weight ratio heuristic ($R = \frac{\text{KnownWeight}}{\text{TotalWeight}}$).

---

## 3. Privacy & Security Gaps

### 3.1 Field Encryption Key Security
- **Target Spec**: Production system must refuse to start without a valid 256-bit environment key.
- **Current Engine**: Fallback key used silently when environment variable is missing.

### 3.2 Anti-Trilateration Distance Coarsening
- **Target Spec**: Distance calculations must obscure exact coordinates into coarsened geographic rings.
- **Current Engine**: Raw lat/lng coordinates used directly in Haversine calculation.
