# TERMS_AND_CONDITIONS_RESEARCH.md — Check Platform Legal, Regulatory & Terms Framework

**Platform:** Check (*"Compatibility Verified"*)  
**Version:** 1.0.0 (Research & Production Terms Architecture)  
**Date:** October 2026  
**Governing Technical Standards:** Master Build Specification §0.11, §0.16, §19, §21, §33, §34, D-14, D-17, D-23  

---

## Executive Summary & Regulatory Context (2026 Landscape)

Online dating and compatibility platforms face an unprecedented wave of statutory regulation across the **United Kingdom**, the **European Union**, the **United States** (federal FTC and state levels including California, New York, New Jersey, and Texas).

Unlike legacy swipe apps (Tinder, Bumble, Hinge) whose business models rely on gamified intermittent reinforcement and opaque algorithmic suppression, **Check** is built on:
1. **Deterministic Multi-Stage Compatibility**: Mathematical harmonic mutuality with **0.00% dealbreaker violations (Invariant D-14)**.
2. **Strict Pay-to-Win Algorithmic Isolation (Invariant D-23)**: Monetary transactions have zero influence over candidate scoring or ranking.
3. **Application-Layer AES-256-GCM Field-Level Encryption (FLE)**: Tier 4 protected personal attributes.
4. **In-Person Encounter Safety & Clinical Feedback**: Transition from digital dialogue to physical venues.

This document synthesizes global legal obligations into an actionable **Terms of Service (ToS)** and **Member Agreement** blueprint.

---

## 1. Statutory Compliance Matrix

| Regulatory Regime | Key Requirements | Check Architecture Implementation |
| :--- | :--- | :--- |
| **UK Online Safety Act (OSA 2023–2026)** | • Proactive mitigation of priority offences (cyberflashing, stalking, romance fraud, intimate image abuse).<br>• Highly effective age assurance (strict 18+ enforcement).<br>• Ofcom compliance and enforceable safety systems. | • Zero unsolicited media ingress; photos screened/moderated.<br>• Mandatory age verification gate during beta cohort onboarding.<br>• Single-use cryptographic invite codes (`KIN-FOUNDER-2026`). |
| **GDPR Art. 9 & UK Data Protection Act (Special Category Data)** | • Explicit, granular consent for processing sexual orientation, relationship structure, neurotype, and sensory/medical accessibility data.<br>• Right to be forgotten (Art. 17). | • 6-permission matrix (`perm_store`, `perm_display`, `perm_searchable`, `perm_matchable`, `perm_private`, `perm_verified`).<br>• AES-256-GCM authenticated encryption for Tier 4 data.<br>• Cascading cryptographic account purge. |
| **California Dating Service Contract Act (Civ. Code §§ 1694–1694.4)** | • Written contract disclosure.<br>• **Statutory 3-business-day right to cancel** with full refund.<br>• Death/disability relief provisions. | • Embedded statutory 72-hour refund cancellation link in checkout emails.<br>• Transparent refund request mechanism. |
| **FTC Negative Option Rule & Click-to-Cancel Rule** | • Simple, one-click online subscription cancellation equal to sign-up ease.<br>• Clear pre-purchase disclosure of renewal terms, amount, and billing dates. | • Instant self-service cancel button in `/settings/subscription` (`POST /api/v1/subscriptions/cancel`). Zero retention dark patterns. |
| **New Jersey Internet Dating Safety Act (N.J.S.A. 56:8-171) & NY GBL § 394-cc** | • Prominent banner disclosure stating whether criminal background checks are performed.<br>• Clear safety awareness guidelines for offline meetings. | • Statutory disclaimer banner on onboarding & First Date Brief.<br>• Low-stimulus venue guidance and public-meeting safety checklists. |

---

## 2. Core Structural Clauses for Check Terms of Service

### Section 1: Acceptance & Relationship to Technical Invariants
- **Contract Formation**: By registering or claiming a beta cohort token, the user enters a binding contract with Check Technologies Inc.
- **Algorithmic Determinism Affirmation**: Users acknowledge that Check operates on deterministic mathematical scoring based strictly on self-reported inputs. Check expressly disclaims that compatibility scores guarantee interpersonal chemistry, romantic longevity, or physical safety.

### Section 2: Eligibility & Strict 18+ Age Assurance
- **Prohibition of Minors**: Check is strictly for legal adults aged 18 and older. Any misrepresentation of age constitutes material breach and criminal fraud under the UK Online Safety Act.
- **Verification Authority**: Check reserves the right to employ third-party identity and age verification vendors. Accounts failing age assurance are immediately quarantined and purged.

### Section 3: Statutory Offline Safety Disclosures & Background Check Disclaimer
> **MANDATORY STATUTORY NOTICE (NJ N.J.S.A. 56:8-171 & NY GBL § 394-cc):**  
> **CHECK DOES NOT CONDUCT CRIMINAL BACKGROUND CHECKS OR SEX OFFENDER REGISTRY SCREENINGS ON ITS MEMBERS.**  
> *You are solely responsible for your interactions with other members. Check makes no representations or warranties as to the conduct, criminal history, background, or character of any user.*

- **In-Person Meeting Release**: Check provides date briefs and curated venue recommendations (low-stimulus, sensory-friendly environments), but has no physical custody or oversight of in-person dates. Users assume all inherent risks of meeting strangers in physical environments.
- **Mandatory Safety Guidelines**:
  1. Always meet in a populated, public venue.
  2. Inform a trusted friend or family member of your location and time.
  3. Arrange your own independent transportation.
  4. Never disclose financial information, passwords, or home addresses to unverified matches.

### Section 4: Privacy Matrix & Special Category Consent (GDPR Art. 9)
- **Granular Consent Grant**: Users grant Check permission to process declared attributes according to their active Permission Matrix.
- **Tier 4 Field-Level Encryption Guarantee**: Check warrants that attributes designated as Tier 4 (sensitive health, sensory needs) are encrypted client-side or application-layer using AES-256-GCM and cannot be decrypted without authorized user session keys.
- **Prohibition on Doxxing**: Members strictly agree not to capture, screenshot, export, or disseminate any other member's compatibility report, private preferences, or Tier 4 disclosures outside the application. Violation results in permanent ban and potential civil liability.

### Section 5: The "No Pay-to-Win" Algorithmic Covenant (Invariant D-23)
- **Statutory Consumer Covenant**: Check covenants to all members that payment of subscription fees, supporter tier contributions, or donations **never** alters match recommendations, search visibility, compatibility scores, or ranking orders.
- **Paid Tier Scope**: Paid subscriptions (`Supporter`, `Patron`) grant non-algorithmic benefits exclusively: deep relationship insight dossiers, venue reservation partnerships, and development patronage.

### Section 6: Zero-Tolerance Conduct & Community Standards
Any of the following acts triggers immediate account termination, forfeiture of membership fees, and potential law enforcement referral:
1. **Cyberflashing**: Transmitting unsolicited sexually explicit photographs, videos, or messages.
2. **Harassment & Stalking**: Repeated unwanted communication after a member has executed a safety block or closure handshake.
3. **Romance Scams & Commercial Solicitation**: Requesting funds, cryptocurrency, gifts, or promoting external commercial services.
4. **Deceptive Identity**: Impersonation, automated bots, scrapers, or multiple account fabrication.
5. **Intolerance & Hate Speech**: Discrimination or abuse based on race, ethnicity, religion, disability, gender identity, or sexual orientation.

### Section 7: Subscriptions, Renewals & Statutory Cooling-Off Rights
- **Pre-Billing Disclosure**: Clear recurring billing terms ($9.99/mo Supporter) billed monthly until cancelled.
- **Click-to-Cancel**: Cancel anytime with one click in account settings. Cancellation halts future charges immediately.
- **Statutory Cancellation Rights**:
  - **California Residents**: Right to cancel within 3 business days of subscription purchase for a full refund without penalty (California Civil Code § 1694.1).
  - **UK / EEA Residents**: 14-day statutory right of withdrawal under Consumer Contracts Regulations, applicable unless the user has opted for immediate digital performance and waived the cooling-off period.

### Section 8: Limitation of Liability & Warranty Disclaimer
- **"As-Is" Service**: The platform and compatibility engine are provided on an "as-is" and "as-available" basis.
- **Consequential Damages Cap**: To the maximum extent permitted by applicable law, Check’s total cumulative liability for any claim arising out of this agreement or use of the service is capped at the greater of $100 USD or the total fees paid by the user in the preceding 6 months.
- **Exclusion of Emotional / Interpersonal Harm**: Check bears no liability for emotional distress, heartbreak, interpersonal conflict, or physical damages resulting from user encounters.

### Section 9: Dispute Resolution, Binding Arbitration & Class Action Waiver
- **30-Day Informal Negotiation**: Parties agree to negotiate in good faith before initiating arbitration.
- **Mandatory Individual Arbitration (US Users)**: Binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules. No class actions or representative proceedings.
- **European & UK Consumer Forum Carve-Out**: Nothing in these terms deprives UK or EU consumers of their statutory right to bring actions before their domestic consumer courts.

---

## 3. Recommended Implementation Architecture for Check

```
┌─────────────────────────────────────────────────────────────────┐
│                      CHECK LEGAL ONBOARDING                     │
├─────────────────────────────────────────────────────────────────┤
│ 1. Mandatory 18+ Age Gate                                       │
│    "By continuing, you verify you are 18+ years old."           │
│                                                                 │
│ 2. Statutory Safety Notice (NJ/NY Compliant)                    │
│    "Check does NOT conduct criminal background checks.          │
│     Review our In-Person Safety Guidelines before dates."       │
│                                                                 │
│ 3. GDPR Art. 9 Special Category Affirmative Consent             │
│    "You control your 6 privacy permissions. Tier 4 health &     │
│     sensory data is protected by AES-256-GCM encryption."       │
│                                                                 │
│ 4. Algorithmic Covenant & Invariant D-23 Notice                 │
│    "We never sell ranking or compatibility boost. Paid tiers    │
│     support ethical server operations only."                    │
│                                                                 │
│ [x] I have read and agree to the Terms of Service & Privacy Doc │
│                    [ Enter Check Platform ]                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Proposed File Additions to Codebase

1. [`TERMS_OF_SERVICE.md`](file:///c:/Users/vD/Documents/antigravity/modest-shannon/TERMS_OF_SERVICE.md): The full, formal member agreement text.
2. `src/components/TermsModal.tsx`: An accessible, plain-English interactive modal for reviewing terms, safety guidelines, and statutory disclosures directly within the React UI.
3. Integration in `src/components/FirstRunOnboardingModal.tsx` and `src/components/Navbar.tsx` footer link.
