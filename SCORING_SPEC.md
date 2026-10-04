# SCORING_SPEC.md — Scoring Mathematics & Algorithmic Formulations

**Document Version:** 1.0.0  
**Status:** Canonical Algorithmic Scoring Specification  
**Governing Standard:** Master Build Specification §7–§13  

---

## 1. Mathematical Scoring Principles

The scoring engine evaluates human alignment across independent dimensions using deterministic, explainable mathematical operators. It enforces four constitutional invariants:
1. **Separation of Dimensions:** Individual dimensions (values, lifestyle, feasibility) are computed independently before aggregation.
2. **Missing-Information Denominator Normalization:** Unknown or non-disclosed attributes are omitted from both the numerator and denominator:
   $$S = \frac{\sum_{i \in \text{known}} w_i \cdot \sigma_i}{\sum_{i \in \text{known}} w_i} \times 100$$
3. **Harmonic Mutuality:** Unilateral interest is penalised via the harmonic mean, ensuring that matches require reciprocal alignment.
4. **Decoupled Confidence:** Epistemic uncertainty is tracked separately and does not penalise compatibility.

---

## 2. Attribute-Level Scoring Functions $\sigma_i$

### 2.1 Categorical Matrix Matching
For categorical attributes (e.g. Relationship Intent, Conflict Resolution Style) where values have structured affinities:
$$\sigma_{\text{cat}}(v_{\text{eval}}, v_{\text{target}}) = \mathbf{M}[v_{\text{eval}}, v_{\text{target}}] \in [0.0, 1.0]$$
Where $\mathbf{M}$ is a symmetric or directional affinity matrix. For exact categorical requirements:
$$\sigma_{\text{exact}}(v_{\text{eval}}, v_{\text{target}}) = \begin{cases} 1.0 & \text{if } v_{\text{target}} \in v_{\text{acceptable}} \\ 0.0 & \text{otherwise} \end{cases}$$

### 2.2 Scalar Distance with Flexibility Margins
For numeric and scalar attributes (e.g. Age, Distance, Work Hours), let $\Delta = |v_{\text{target}} - v_{\text{preferred}}|$ and $\tau$ be the user's base tolerance.
If $\Delta \le \tau$:
$$\sigma_{\text{scalar}} = 1.0$$
If $\Delta > \tau$, let $\text{excess} = \Delta - \tau$. Given user flexibility $\Phi \in [0, 100]$:
$$\sigma_{\text{scalar}}(\Delta, \tau, \Phi) = \max\left(0.10, 1.0 - \left(\frac{\text{excess}}{\text{decay\_scale} \cdot \left(1 + \frac{\Phi}{50}\right)}\right) \times 0.8\right)$$
- If the attribute is designated as a hard dealbreaker (`MUST` or `dealbreaker = true`) and $\Delta > \tau + \text{flex\_margin}$, the candidate is disqualified ($\text{eligible} = \text{false}, S = 0$).

### 2.3 Multi-Select Overlap (Values, Passions, Cultural Nuances)
For multi-value attributes evaluated through set intersection:
$$\sigma_{\text{set}}(A, B) = \frac{|A_{\text{sought}} \cap B_{\text{declared}}|}{|A_{\text{sought}}|}$$
If the evaluator has no specific requirement but desires shared affinity:
$$\sigma_{\text{jaccard}}(A, B) = \frac{|A \cap B|}{|A \cup B|}$$

### 2.4 Multi-Modal Attraction Profiling (Spec §12)
Attraction is decomposed into six independent modalities:
1. **Physical:** Declared aesthetic and somatic resonance.
2. **Emotional:** Attachment style and emotional pacing.
3. **Intellectual:** Shared curiosity, intellectual breadth, discourse style.
4. **Romantic:** Romantic orientation congruence, courtship pacing.
5. **Sexual:** Intimacy cadence, libido rhythm, communication comfort.
6. **Social:** Extroversion/introversion synergy, social battery management.

$$\sigma_{\text{attraction}}(A \to B) = \sum_{m \in \text{Modalities}} w_m \cdot \sigma_m(A, B)$$
*Note: Under no circumstances are attraction scores inferred from profile photographs.*

---

## 3. Geographic & Temporal Feasibility

### 3.1 Geographic Feasibility
Given great-circle distance $d(A, B)$ computed via the Haversine formula:
$$\sigma_{\text{geo}}(A \to B) = \begin{cases} 
1.0 - 0.2 \left(\frac{d}{d_{\max}}\right) & \text{if } d \le d_{\max} \\
\max\left(0.1, 0.8 - 0.7 \left(\frac{d - d_{\max}}{d_{\text{flex}} + 1}\right)\right) & \text{if } d_{\max} < d \le d_{\max} + d_{\text{flex}} \\
0.0 & \text{if } d > d_{\max} + d_{\text{flex}} \text{ (Dealbreaker: Excluded)}
\end{cases}$$

### 3.2 Temporal Feasibility
Evaluates weekly free-time schedule overlap and sleep chronotype alignment:
$$\sigma_{\text{temp}} = 0.5 \cdot \sigma_{\text{chronotype}} + 0.5 \cdot \min\left(1.0, \frac{\text{Shared Free Hours / Week}}{10}\right)$$

---

## 4. Mutuality Formulation & Comparison

Let $S_{A \to B}$ and $S_{B \to A}$ be directional compatibility scores in $[0, 100]$. The platform evaluates five aggregation methods:

| Method | Formula | Asymmetry Handling $(95, 25)$ | Property Evaluation |
| :--- | :--- | :--- | :--- |
| **Arithmetic Mean** | $\frac{S_{AB} + S_{BA}}{2}$ | $60.0\%$ | **Rejected:** Masks severe unilateral mismatch. |
| **Geometric Mean** | $\sqrt{S_{AB} \cdot S_{BA}}$ | $48.7\%$ | Moderate penalty for asymmetry. |
| **Harmonic Mean** | $\frac{2 \cdot S_{AB} \cdot S_{BA}}{S_{AB} + S_{BA}}$ | **$39.6\%$** | **Canonical Choice:** Severely penalises one-sided interest; zero-floor. |
| **Minimum** | $\min(S_{AB}, S_{BA})$ | $25.0\%$ | Aggressive; discards positive sentiment completely. |
| **Weighted Reciprocal** | $\lambda \min + (1-\lambda)\text{mean}$ | Scalable | Parameter-dependent. |

### Canonical Mutuality Equation:
$$S_{\text{mutual}}(A, B) = \begin{cases} 0 & \text{if } \text{isExcluded} \lor S_{AB} = 0 \lor S_{BA} = 0 \\ \operatorname{round}\left(\frac{2 \cdot S_{AB} \cdot S_{BA}}{S_{AB} + S_{BA}}\right) & \text{otherwise} \end{cases}$$

---

## 5. Epistemic Confidence Formulation

Confidence $C \in [0, 100]$ reflects the proportion of active criteria backed by explicit user declarations rather than unknown blanks:

$$C(A, B) = \operatorname{round}\left(100 \times \min\left(\frac{W_{\text{known}}(A \to B)}{W_{\text{total}}}, \frac{W_{\text{known}}(B \to A)}{W_{\text{total}}}\right) \times \gamma_{\text{verif}}\right)$$

Where $\gamma_{\text{verif}} = 1.0$ if photo/ID verified, $0.85$ if unverified.
- $C \ge 75\%$: **High Confidence**
- $50\% \le C < 75\%$: **Moderate Confidence**
- $C < 50\%$: **Low Confidence (Exploratory / Incomplete Data)**
