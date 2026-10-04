# Universal Compatibility & Relationship-Discovery Platform

An auditable, privacy-conscious, explainable, and reciprocal matching system designed to represent the broadest practical range of human relationship preferences, identities, constraints, lifestyles, values, attraction patterns, accessibility requirements, relationship structures, and behavioural outcomes.

Built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Vite**, and **Lucide Icons**.

---

## 🎯 Architectural Mission & Non-Negotiable Tenets

This platform is **not a swipe-based dating app**. It optimizes strictly for **Mutual Compatibility** rather than swipes, engagement, popularity, or profile visibility.

1. **Deterministic Core Before ML (Rule 8 & 9):** 100% deterministic, explainable matching engine with zero probabilistic machine learning in the MVP core.
2. **Strict Bidirectional Mutuality ($A \leftrightarrow B$):** Matching is symmetric. A candidate who satisfies Person A perfectly but for whom Person A breaches a dealbreaker is assigned an overall Mutual Compatibility Score of zero ($S_{\text{mutual}} = 0$).
3. **Decoupled Compatibility & Epistemic Confidence:** Missing information is never penalized as incompatibility. Compatibility ($S$) and Confidence ($C$) are evaluated independently.
4. **Progressive Disclosure UX (Spec §30):** 6 clean stages without bureaucratic survey fatigue.
5. **No Discriminatory Rules / No Inferred Sensitive Traits:** Race, gender identity, orientation, disability, and health status are never inferred from images or secondary signals.

---

## 🌟 Platform Capabilities

- **✨ Transparent Match Cards (Spec §31):** Every recommendation displays relationship intent, mutuality score, directional breakdown ($A \to B$ vs $B \to A$), epistemic confidence, strong alignments (+), potential frictions (-), unknowns (?), and explicit "Why recommended" justifications.
- **🔍 Deep 12-Dimension Report Modal:** Complete inspectable breakdown of Hard Gating, Relationship Alignment, Family Plans, Lifestyle & Diet (Spec §5 vegetarian distinctions), Core Values, Multi-Modal Attraction (6 modalities), Communication Pacing, Geographic Feasibility, Temporal Rhythms, and Confidence Coverage.
- **📋 6-Stage Progressive Profile Architect (Spec §30):**
  - Stage 1: Identity & Pronouns (self-declared)
  - Stage 2: Relationship Intention & Structure (monogamous, polyamorous, ENM, flexible)
  - Stage 3: Weighted Preferences (importance 1–5)
  - Stage 4: Non-Negotiable Dealbreakers (hard eligibility gates)
  - Stage 5: Controlled Flexibility (0–100% partial credit relaxation)
  - Stage 6: Deeper Psychological & Circadian Resonance
- **⚙️ Preference Optimization Engine (Spec §32):** What-if candidate pool simulator showing pool expansion and estimated compatibility impact with explicit statutory disclaimers.
- **⚠️ Contradiction Auditor (Spec §14):** Automatically surfaces logical preference deadlocks (e.g. open to long-distance vs 10km maximum radius; MUST with 90% flexibility) with 1-click resolution.
- **🔬 Diagnostic Pair Inspector (Spec §7 & §26):** Live testbed to evaluate any two profiles, swap evaluation directions, and copy the canonical `evaluateMatch` JSON contract.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (on Windows PowerShell, execute `npm.cmd`)

### Development & Verification

```bash
# Start Vite development server
npm.cmd run dev

# Run full TypeScript typecheck
npx.cmd tsc -b

# Execute canonical invariant test suite
npx.cmd tsx src/utils/testMatchingEngine.ts
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
