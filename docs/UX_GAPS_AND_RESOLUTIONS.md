# UX GAPS & RESOLUTIONS REPORT
**Branch**: `design/expert-ui-review`  
**Date**: October 9, 2026  

---

## 1. End-to-End User Journey Walkthrough & Identified Gaps

The complete user journey was audited from Landing Page through Discovery, Onboarding, Conversation, and Settings:

```text
LANDING → ACCOUNT/AUTH → ONBOARDING → SELF/PREFERENCE INPUT → PROFILE UNDERSTANDING → MATCH DISCOVERY → MATCH EXPLANATION → PASS/CONNECT → CONVERSATION → DATE BRIEF → ACCOUNT/SETTINGS
```

### Identified Gaps & Applied Resolutions

1. **Gap 1: Filter Dead-End (Missing State)**
   - **Problem**: Filtering by "High Fit (≥80%)" when no matches qualified produced an empty screen.
   - **Resolution**: Added explicit Apple-style empty state container with an inline "Reset Filter" CTA button.

2. **Gap 2: Ambiguous Compatibility Scores (Psychology & Trust)**
   - **Problem**: Compatibility score pills could be perceived as "algorithmic judgment" or "false scientific precision."
   - **Resolution**: Reframed score badges under explicit non-coercive categories ("WHY THIS CONNECTION MAY BE WORTH EXPLORING", "STRONG ALIGNMENT", "POTENTIAL FRICTION", "PRACTICAL FIT"), reinforcing human agency.

3. **Gap 3: Keyboard Dismissal in Dropdown Menus (Accessibility)**
   - **Problem**: Opening dropdown menus in the header navigation locked keyboard focus without an obvious exit key.
   - **Resolution**: Added global `Escape` key event listener to immediately close all open navigation menus.

4. **Gap 4: Image Error Fallback (Robustness & Polish)**
   - **Problem**: If candidate photo URLs failed to resolve over slow mobile networks, broken browser image placeholders rendered.
   - **Resolution**: Integrated graceful fallback image URLs to guarantee consistent visual rendering.

---

## 2. Comprehensive Missing UX States Inventory

| State | Implementation Details | Verified Component |
| :--- | :--- | :--- |
| **DEFAULT** | Clean initial slate with initial user & candidate data | `App.tsx` |
| **LOADING** | Frosted glass skeleton shimmers | `MatchCard.tsx` |
| **EMPTY** | Empty match state with CTA to reset filter criteria | `App.tsx` |
| **FILTERED** | Filter capsule toggle (`All`, `Eligible`, `High Fit`) | `App.tsx` / `Navbar.tsx` |
| **ERROR / FALLBACK** | Broken image fallback handler | `MatchCard.tsx` |
| **KEYBOARD DISMISS** | `Escape` key menu dismissal | `Navbar.tsx` |
| **REDACTED / PRIVACY** | Distance band coarsening (< 5 km, 5-15 km, etc.) | `MatchCard.tsx` |
