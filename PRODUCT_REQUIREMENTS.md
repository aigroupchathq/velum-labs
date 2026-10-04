# PRODUCT_REQUIREMENTS.md — Universal Compatibility & Relationship-Discovery Platform

**Document Version:** 1.0.0  
**Status:** Product Requirements Baseline  
**Governing Standard:** Master Build Specification §1, §4–§20, §30–§34  

---

## 1. Product Objective & Paradigm Shift

The Universal Compatibility & Relationship-Discovery Platform is built to answer the fundamental human relational question:
> "Given two people, their stated requirements, preferences, relationship intentions, lifestyles, values, attraction preferences, constraints, flexibility, behavioural signals and available information: how compatible are they, how mutually compatible are they, what is unknown, what conflicts exist, and why is the recommendation being made?"

The product explicitly **rejects**:
- The "swipe deck" / Skinner box engagement-loop paradigm.
- Algorithmic popularity feedback loops (ELO ranking, attractiveness cascades).
- Pay-to-win exposure boosts (SuperLikes, Gold visibility tiers).
- Collapsing complex multi-modal attraction and human identity into superficial photo cards.

The product **optimises for**:
- **Mutual compatibility** evaluated bidirectionally ($A \leftrightarrow B$).
- **Zero-tolerance hard eligibility gating** for explicit dealbreakers.
- **Epistemic honesty**: Missing information is never treated as incompatibility.
- **Explainability**: Every recommendation discloses positive alignments, friction points, and unknowns.
- **Safety and non-discrimination**: Complete user control over sensitive attributes.

---

## 2. Core Functional Requirements

### FR-01: Ontological Distinction Enforcement
The system must distinguish between:
1. **IDENTITY**: Self-declared nature (who a person is).
2. **INTENTION**: Relationship objective (long-term, casual, platonic life partner, etc.).
3. **REQUIREMENT (`MUST`)**: Non-negotiable condition for eligibility.
4. **PREFERENCE (`STRONG_PREFERENCE`, `PREFERENCE`, `AVOID`)**: Weighted desires along a continuum.
5. **DEALBREAKER**: Explicit exclusion boundary.
6. **FLEXIBILITY**: Quantifiable tolerance ($0–100\%$) for controlled relaxation.
7. **ATTRACTION**: Physical, emotional, intellectual, romantic, sexual, and social resonance.
8. **COMPATIBILITY**: Mathematical alignment of criteria and attributes.
9. **MUTUALITY**: Bidirectional harmonic aggregation.
10. **FEASIBILITY**: Geographic and temporal viability.
11. **UNCERTAINTY**: Information incompleteness tracking.
12. **BEHAVIOUR**: Verifiable communication pacing and respectfulness.
13. **OUTCOME**: Downstream real-world trajectory tracking.

### FR-02: Structured User Model & Six-Stage Progressive Disclosure (Spec §30)
The onboarding and profiling interface must avoid giant bureaucratic questionnaires through a 6-stage progressive disclosure journey:
- **Stage 1 (Who are you?):** Core identity, self-declared values, pronouns, basic bio, voluntary lifestyle traits.
- **Stage 2 (What are you looking for?):** Relationship intention, preferred relationship structure (monogamous, polyamorous, ENM, flexible), attraction modalities.
- **Stage 3 (What matters?):** Weighted preferences across values, lifestyle, family vision, communication cadence (importance $1–5$).
- **Stage 4 (What are your dealbreakers?):** Explicit exclusion criteria on hard-constraint-capable attributes.
- **Stage 5 (What are you flexible about?):** Setting flexibility margins ($0–100\%$) for scalar and ordinal preferences.
- **Stage 6 (Optional deeper compatibility):** In-depth exploration of communication styles, sensory preferences, chronotypes, and civic values.

### FR-03: Deterministic Matching Engine Output (Spec §7, §11)
`evaluateMatch(userA, userB)` must return a structured report containing:
- `eligible` (boolean)
- `hardConflicts` (array of dealbreaker violations)
- `compatibility` (directional $A \to B$ and $B \to A$)
- `mutuality` (harmonic aggregation)
- `attraction` (physical, emotional, intellectual, romantic, sexual, social)
- `preferenceAlignment`
- `valueAlignment`
- `lifestyleAlignment`
- `relationshipAlignment`
- `familyAlignment`
- `communicationAlignment`
- `geographicFeasibility`
- `temporalFeasibility`
- `uncertainty` (coverage and unpopulated fields)
- `confidence` (epistemic confidence level)
- `explanation` (structured positive drivers, frictions, and unknowns)

### FR-04: Preference Contradiction Detection (Spec §14)
The system must actively detect and surface contradictions in user input before matching:
- User states "Distance doesn't matter" (`NEUTRAL`) but specifies a hard $10\text{ km}$ maximum radius.
- User marks a preference as both `MUST` and assigns $70\%$ flexibility.
- User specifies mutually exclusive requirements (e.g. requires non-smoker but self-describes as regular heavy smoker with non-smoker dealbreaker against themselves).
- Contradictions trigger a user notification banner with clear resolution options.

### FR-05: Transparent Match Cards (Spec §31)
Every presented recommendation must display:
- Profile basics (Name, age, location, verified badge).
- Primary relationship intention and structure.
- Mutuality score with confidence calibration.
- Strong alignment points (synergies).
- Potential friction points (relaxed tolerances).
- Unknown information dimensions.
- Distance and temporal overlap feasibility.
- Explicit "Why recommended" justification.
- *Strict prohibition on fabricated scientific certainty.*

### FR-06: Interactive Preference Optimisation (Spec §32)
Users must have an optional "Optimise my preferences" simulation tool:
- Displays current candidate pool size meeting all constraints.
- Simulates relaxing specific constraints (e.g. expanding distance by $15\text{ km}$, adjusting age tolerance by $\pm 2$ years).
- Projects estimated candidate pool expansion and average compatibility shift.
- Explicitly labels all projections as estimates.

---

## 3. Non-Functional & Ethical Requirements

1. **Deterministic Baseline First (Rule 8 & 9):** No probabilistic ML or recommendation black-box models in MVP.
2. **Missing Information Neutrality (Rule 12):** Unknown data points do not reduce compatibility scores; they reduce epistemic confidence.
3. **No Image Inference (Rule 11 & Spec §12):** Sensitive traits, race, gender expression, or beauty ratings must NEVER be inferred via computer vision.
4. **Popularity Dampening (Spec §17):** Candidate presentation must cap exposure concentration ($Gini \le 0.40$), preventing "superstar" profile monopolisation.
5. **Privacy by Design (Spec §19):** Six separate permissions (`store`, `display`, `searchable`, `matchable`, `private`, `verified`) for every attribute.
