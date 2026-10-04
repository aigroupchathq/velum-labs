# PRIVACY_SPEC.md — Universal Compatibility Platform Privacy Architecture

**Document Version:** 1.0.0  
**Status:** Canonical Privacy Architecture Specification  
**Governing Standard:** Master Build Specification §0.11, §0.16, §19, §21  

---

## 1. Core Privacy Philosophy: Consent & Granular Control

Unlike conventional platforms that monetize user data or aggregate profiles into global discoverability graphs without user control, this platform guarantees that **every attribute possesses an independent permission matrix**.

A user may disclose an attribute for their own profile display while explicitly forbidding it from being indexed for general search or algorithmic matching.

---

## 2. The Six Granular Permissions (Spec §19)

For every individual attribute $k$ belonging to User $U$, six independent boolean permissions are maintained:

```
                    ┌─► perm_store      : Platform may persist this value
                    ├─► perm_display    : May be rendered on profile UI
attribute_values ───┼─► perm_searchable : May appear in search / filter queries
                    ├─► perm_matchable  : May be evaluated by matching engine
                    ├─► perm_private    : Visible only to User U (overrides display)
                    └─► perm_verified   : Identity verification state (system-set)
```

### Permission Interaction Rules:
1. `perm_store = false`: Value is permanently wiped from database.
2. `perm_matchable = false`: The matching engine treats this attribute as **UNKNOWN** when evaluating User $U$ against any potential partner. It contributes zero weight to the compatibility denominator and is never revealed in explanation templates.
3. `perm_display = false`: The attribute is hidden from candidate views, even if used for matching under explicit mutual agreement.

---

## 3. Special Category Data Protection (GDPR Art. 9 & CCPA)

The platform classifies attributes into four privacy tiers:

| Tier | Category Examples | Storage Policy | Matching Default |
| :--- | :--- | :--- | :--- |
| **Tier 1: Public Discovery** | Display name, age, city/region, general hobbies. | Plaintext in RDBMS. | Matchable by default. |
| **Tier 2: Match-Only** | Detailed values, personality traits, communication habits. | Plaintext in RDBMS, scoped access. | Matchable only after user confirms interest. |
| **Tier 3: Reciprocal Disclosure** | Discrete family plans, lifestyle habits. | Scoped RDBMS with mutual handshake requirement. | Matchable with opt-in. |
| **Tier 4: Encrypted / Sensitive** | Sexual health, neurodivergent accommodations, specific medical needs. | **AES-256-GCM Field-Level Encrypted.** Keys managed in KMS. | **Non-matchable by default.** Requires explicit separate consent. |

---

## 4. Data Minimization & Retention Schedules (Spec §21)

1. **Unmutual Recommendations:** Cached evaluation records in `compatibility_evaluations` where neither user took action expire and are hard-deleted after 90 days.
2. **Ephemeral Geolocation:** Raw GPS coordinates from mobile devices are converted to Geohash cells on client ingress and discarded from memory immediately. No GPS coordinate history is ever logged.
3. **Right to Be Forgotten (GDPR Art. 17):** User account deletion executes an immediate cascading purge across `users`, `profiles`, `attribute_values`, `preferences`, and `matches`. Audit logs retain only non-reversible SHA-256 transaction hashes.
