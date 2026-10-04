# RESEARCH_DATABASE.md — Scientific Literature Review & Empirical Foundations

**Document Version:** 1.0.0  
**Status:** Canonical Scientific & Theoretical Reference  
**Governing Standard:** Master Build Specification §0.14, §0.15, §24, §42  

---

## 1. Executive Scientific Overview

The architecture of the Universal Compatibility & Matching Platform is grounded in empirical relationship science, behavioral economics, and two-sided matching theory. It synthesizes foundational research across four key scientific disciplines:

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│     Relationship Science        │       │       Two-Sided Markets         │
│  (Finkel, Gottman, Huston)     │       │     (Gale, Shapley, Roth)       │
└────────────────┬────────────────┘       └────────────────┬────────────────┘
                 │                                         │
                 ▼                                         ▼
         ┌─────────────────────────────────────────────────────────┐
         │ Universal Compatibility & Relationship Discovery Platform│
         └────────────────────────┬────────────────────────────────┘
                                  │
                 ▲                                         ▲
                 │                                         │
┌────────────────┴────────────────┐       ┌────────────────┴────────────────┐
│   Choice & Decision Theory      │       │    Reciprocal Recommenders      │
│  (Schwartz, Heino, Tversky)     │       │     (Pazzani, Brozovsky)        │
└─────────────────────────────────┘       └─────────────────────────────────┘
```

---

## 2. Annotated Bibliography & Key Findings

### 2.1 Dyadic Interaction & Longitudinal Stability
1. **Gottman, J. M., & Levenson, R. W. (2000).** *The timing of divorce: Predicting when a couple will divorce over a 14-year period.*
   - **Key Finding:** Longitudinal relationship dissolution is primarily predicted not by superficial hobby divergence, but by dysfunctional conflict regulation styles (contempt, defensiveness, stonewalling).
   - **System Translation:** Category 17 (Communication & Conflict Style) is given high algorithmic weight; exact alignment in conflict de-escalation is treated as a foundational compatibility factor.
2. **Huston, T. L., et al. (2001).** *The connubial crucible: Newlywed years as predictors of marital delight, distress, and divorce.*
   - **Key Finding:** Early idealization without realistic value congruency is a major driver of disillusionment.
   - **System Translation:** The platform emphasizes authentic dealbreaker disclosure and transparent tension mapping over romantic gamification.

### 2.2 The Flaws of Algorithmic Dating Platforms
3. **Finkel, E. J., Eastwick, P. W., Karney, B. R., Reis, H. T., & Sprecher, S. (2012).** *Online dating: A critical analysis from the perspective of psychological science.*
   - **Key Finding:** Algorithmic platforms that claim "scientific mathematical formulas predicting soulmates" fabricate empirical certainty. Static attributes predict only a fraction of relational satisfaction; mutuality and shared interactive context matter far more.
   - **System Translation:** Rule 14 & 15: The platform strictly forbids claiming that compatibility scores represent "probabilities of relationship success" and explicitly highlights epistemic uncertainty.
4. **Heino, R. D., Ellison, N. B., & Gibbs, J. L. (2010).** *Relationshopping: Investigating the market metaphor in online dating.*
   - **Key Finding:** Swipe interfaces transform human relationship discovery into a commoditized "shopping catalogue," triggering chronic dissatisfaction, depersonalization, and high unmatch rates.
   - **System Translation:** Rejection of swipe card decks in favor of multi-dimensional transparent recommendation cards with explainability and progressive disclosure.

### 2.3 Two-Sided Matching & Reciprocal Recommendation
5. **Gale, D., & Shapley, L. S. (1962); Roth, A. E. (1982).** *College admissions and the stability of marriage.*
   - **Key Finding:** Stable matches in two-sided markets require mutual preferences; unilateral optimization produces instability, market congestion, and widespread failure.
   - **System Translation:** Harmonic mean aggregation $H(S_{AB}, S_{BA})$ guarantees that high unilateral attraction cannot compensate for partner rejection.
6. **Brozovsky, L., & Petricek, V. (2007).** *Recommender system for online dating service.*
   - **Key Finding:** Traditional collaborative filtering fails in dating because the recommended "item" (another human being) must also choose the requester.
   - **System Translation:** Bidirectional preference evaluation with explicit eligibility gating and popularity dampening.
