# GLOBAL PRIVACY POLICY & DATA PROCESSING ADDENDUM

**Platform:** Check (*"Compatibility Verified"*)  
**Operated by:** Check Technologies, Inc. (Data Controller)  
**Effective Date:** October 6, 2026  
**Version:** 2.0.0 (Global GDPR / CCPA / UK DPA Edition)  

---

> ### 🔒 EXECUTIVE SUMMARY: THE CHECK PRIVACY CHARTER
> - **We do not sell, rent, or monetize your data:** Zero ad networks, zero data brokers, zero tracking pixels.
> - **You own your privacy matrix:** Every attribute has 6 independent user-controlled permissions (`perm_store`, `perm_display`, `perm_searchable`, `perm_matchable`, `perm_private`, `perm_verified`).
> - **Tier 4 Field-Level Encryption:** Sensitive neurodivergent accommodations, sensory limits, and accessibility needs are encrypted at rest with **AES-256-GCM**.
> - **Anti-Trilateration Geolocation:** Raw GPS coordinates are discarded immediately after snapping to 15km coarse hex bins. We never store or display your exact location.
> - **Statutory Rights Honored:** Right to be Forgotten (GDPR Art. 17), Right of Access (Art. 15), and CCPA "Do Not Sell/Share" compliance natively automated in software.

---

## 1. Information We Collect & The 4 Privacy Tiers

Check organizes all user information into four distinct architectural tiers with escalating cryptographic and access controls:

| Data Tier | Categories & Examples | Technical Storage & Encryption | Algorithmic Evaluation |
| :--- | :--- | :--- | :--- |
| **Tier 1: Public Identity** | Display name, verified age, city/region name, photos, self-written bio. | Plaintext RDBMS, globally secured via TLS 1.3 at transit. | Rendered on recommendation cards; age/city used for initial coarse binning. |
| **Tier 2: Relational Architecture** | Primary intentions, relationship structure, core values, communication pacing, attachment reflections. | Normalised RDBMS (`attribute_values`), access scoped to authenticated users. | Evaluated for directional compatibility only when both parties fall within mutual search filters. |
| **Tier 3: Reciprocal Lifestyle** | Diet, smoking habits, family planning/children intent, cleanliness standards, pet allergies. | Scoped database storage with granular permission gating. | Evaluated for hard dealbreaker gating (Invariant D-14) under user consent. |
| **Tier 4: Encrypted Sensitive Data (Special Category)** | Neurodivergent sensory thresholds (fluorescent lights, noise levels), physical accessibility (step-free), medical accommodations. | **Application-Layer AES-256-GCM Field-Level Encryption (FLE).** Keys managed via KMS; distinct per-user Data Encryption Keys (DEKs). | **NON-MATCHABLE BY DEFAULT.** Evaluated only with explicit separate affirmative opt-in. Plaintext is NEVER visible to administrators or other users. |

---

## 2. The 6-Dimension Permission Matrix (Spec §19)

Unlike conventional dating services that treat profile data as a monolithic broadcast, Check empowers members with independent control over each declared attribute $k$:

1. `perm_store (boolean)`: Consent to persist the attribute in database storage. If false, the value is purged from storage immediately.
2. `perm_display (boolean)`: Controls whether the value may be visually rendered on your public profile or candidate cards.
3. `perm_searchable (boolean)`: Controls whether candidate discovery filters may index this attribute.
4. `perm_matchable (boolean)`: Controls whether the compatibility engine may evaluate this attribute. If false, the attribute is treated as **UNKNOWN**; it contributes 0 weight to the denominator and is never revealed in explanation templates.
5. `perm_private (boolean)`: Enforces strict sanctuary mode; visible exclusively to the authenticated account owner.
6. `perm_verified (boolean)`: System-certified verification badge indicating trusted source verification.

---

## 3. Lawful Basis for Processing (GDPR Art. 6 & Art. 9)

3.1. **Contractual Necessity (Art. 6(1)(b)):** Processing of Tier 1 and Tier 2 data is necessary for the performance of our contract with you (providing match evaluations, generating daily slates, and facilitating intentional connections).

3.2. **Explicit Consent for Special Category Data (Art. 9(2)(a)):**
- Information concerning sexual orientation, relationship structure, health/accessibility accommodations, and philosophical worldviews constitutes **Special Category Personal Data** under GDPR Article 9 and sensitive personal information under CCPA.
- You provide **explicit affirmative consent** upon declaring these attributes during onboarding. You may withdraw consent at any time without penalty by removing the attribute or setting `perm_matchable = false`.

3.3. **Legitimate Interests (Art. 6(1)(f)):** Fraud prevention, detecting bot attacks, auditing system invariants, and enforcing zero-tolerance safety policies (e.g., blocking banned users from re-registering).

---

## 4. Ephemeral Geolocation & Anti-Trilateration Privacy (Invariant P-02)

4.1. **Zero Raw GPS Storage:** Mobile and browser location coordinates (latitude and longitude) are ingested ephemerally at API ingress, immediately snapped to a coarse ~15km discrete hexagonal bin (Uber H3 Resolution 7 equivalent), and purged from server memory.

4.2. **Anti-Trilateration Coarsening:** Check never renders exact distances (e.g., "1.4 miles away") because bad actors can geometrically trilaterate a user’s physical residence using three fake accounts. Distances are presented exclusively as broad geographic bands in both metric and imperial units:
- `Local (< 10 km / ~6 mi)`
- `Metro (10–25 km / 6–15 mi)`
- `Regional (25–50 km / 15–30 mi)`
- `Over 50 km / 30+ mi`

---

## 5. Automated Decision-Making & Deterministic Matching (GDPR Art. 22 & EU AI Act)

5.1. **No Legal or Significant Effect:** The Check Compatibility Engine provides recommendations for interpersonal connections. It does not produce legal effects, employment decisions, or credit scores under GDPR Article 22.

5.2. **Deterministic & Explainable Logic:** The algorithm computes:
$$\text{Mutuality} = \frac{2 \times S(A \to B) \times S(B \to A)}{S(A \to B) + S(B \to A)}$$
Users have the statutory right to obtain human intervention, to understand the decision criteria (detailed in our Architecture & Math visualizer), and to adjust their declared weights and flexibility sliders at any time.

---

## 6. Data Retention & Erasure Schedules

| Data Category | Retention Schedule | Deletion Protocol |
| :--- | :--- | :--- |
| **Active User Profiles** | Duration of active account. | Encrypted at rest. |
| **Unmutual Recommendations** | **90 Days** from computation. | Automated cron purge; hard-deleted from `compatibility_evaluations`. |
| **Ephemeral Location Data** | **0 Seconds** (immediate purge after hex snapping). | Discarded from memory immediately. |
| **Encounter Feedback (Beta)** | Anonymized after 30 days. | Stripped of user foreign keys, aggregated into statistical clinical venue benchmarks. |
| **Deleted Accounts (Art. 17)** | **Instantaneous (0 seconds).** | Cascading hard delete across `users`, `profiles`, `attribute_values`, `preferences`, and `matches`. Immutable audit logs retain only non-reversible SHA-256 transaction digests. |

---

## 7. Biometric Information Privacy Notice (Illinois BIPA Compliance)

7.1. **Facial Age & Identity Verification:** If you opt to verify your profile photo or complete age assurance via our identity verification partner, facial geometry scans may be performed to compare your live selfie against your government ID.

7.2. **BIPA Safeguards:**
- Check does not sell, lease, trade, or profit from biometric data.
- Biometric scans are captured directly by our certified verification partner and are permanently destroyed within **twenty-four (24) hours** of verification completion, or upon account deletion, whichever occurs first.

---

## 8. Your Statutory Rights (GDPR, UK DPA, CCPA/CPRA)

You possess the following statutory rights, exercised without charge:
1. **Right of Access (Art. 15):** Request an export of your entire profile and declared attribute values in machine-readable JSON format.
2. **Right to Rectification (Art. 16):** Update or calibrate your preferences and declared values at any time in the Profile Sanctuary.
3. **Right to Erasure / Deletion (Art. 17 / CCPA):** Permanently delete your account and all associated data with one click.
4. **Right to Restrict Processing (Art. 18):** Switch on Incognito Mode (`privacy.incognitoMode = true`) to immediately suspend candidate discovery.
5. **Right to Data Portability (Art. 20):** Export your profile and preference schema.
6. **California "Do Not Sell or Share My Information":** Check **NEVER** sells or shares personal data with third-party advertisers.

To exercise your statutory rights, use the in-app Sanctuary controls or email our Data Protection Officer at `dpo@check-compatibility.internal`.

---

## 9. Contact Our Data Protection Officer (DPO)

**Check Technologies, Inc. — Privacy & Regulatory Office**  
Data Protection Officer: `dpo@check-compatibility.internal`  
Supervisory Authority: UK Information Commissioner’s Office (ICO) & European Data Protection Board (EDPB)

---

## 10. International Representatives & Cross-Border Data Transfers

10.1. **European Union Representative (GDPR Article 27):**  
Check Data Privacy Ireland Limited  
One Grand Canal Dock, Dublin 2, Ireland  
Email: `eu-representative@check-compatibility.internal`

10.2. **United Kingdom Representative (UK Data Protection Act 2018):**  
Check Privacy UK Limited  
100 Bishopsgate, London EC2N 4AG, United Kingdom  
Email: `uk-representative@check-compatibility.internal`

10.3. **Canada Compliance (PIPEDA & Quebec Law 25):**  
Canadian Chief Privacy Officer: `privacy-canada@check-compatibility.internal`  
Canadian subscribers possess full rights of access, correction, de-indexing, and data mobility.

10.4. **Australia Compliance (Privacy Act 1988 & APPs):**  
Australian Privacy Lead: `privacy-australia@check-compatibility.internal`  
Handling of Australian consumer personal information in accordance with the Australian Privacy Principles.

10.5. **Cross-Border Transfers & Standard Contractual Clauses (SCCs):**  
For data transfers from the UK and EEA to our primary compute centers in the United States, Check executes Standard Contractual Clauses (Commission Implementing Decision (EU) 2021/914) and the UK International Data Transfer Addendum (IDTA), augmented by field-level AES-256-GCM encryption (Invariant FLE-03) and strict ephemeral zero-retention policies.

