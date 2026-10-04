# SECURITY_SPEC.md — Platform Security Architecture & Threat Mitigation

**Document Version:** 1.0.0  
**Status:** Canonical Security Architecture Specification  
**Governing Standard:** Master Build Specification §0.16, §20, §35  

---

## 1. Threat Modeling (STRIDE Analysis)

| Threat Category | Specific Attack Vector | Platform Architectural Mitigation |
| :--- | :--- | :--- |
| **Spoofing** | Sybil accounts, identity theft, fake profile creation. | Multi-factor auth, Passkeys/WebAuthn, biometric liveness photo verification (stored as ephemeral hash, never raw facial scan). |
| **Tampering** | Manipulating client-side match evaluations or scores. | **Server-authoritative matching execution.** Client receives read-only results. Checksums and versioned rulesets pinned in audit logs. |
| **Repudiation** | Moderator abuse, disputed preference deletions. | Append-only, write-once-read-many (WORM) `audit_logs` recording all administrative and user preference modifications. |
| **Information Disclosure** | Location trilateration, attribute probing attacks. | Geohash cell coarsening ($\pm 1.5\text{ km}$), pairwise randomized distance jitter, strict API field-level encryption for Tier 4 data. |
| **Denial of Service** | Exhausting recommendation engine via high-frequency constraint mutations. | Token-bucket rate limiting at API gateway (max 10 recommendation recalculations/min per user). |
| **Elevation of Privilege** | Normal user querying unredacted sensitive partner attributes. | Fine-grained row-level and column-level access controls (RLS/CLS) in database; separate internal worker tokens. |

---

## 2. Mitigation of Specific Relational Attack Vectors

### 2.1 Geographic Trilateration Attack Mitigation
- **The Attack:** An adversary creates 3 dummy accounts at known coordinate points, queries distances to a victim, and calculates the exact intersection point (trilateration) to identify their home address.
- **Defense Mechanism:**
  1. Coordinates are never exposed via API.
  2. Exact distances are clamped into coarse buckets ($< 5\text{ km}$, $5–10\text{ km}$, $10–25\text{ km}$, etc.) or perturbed by a deterministic pseudo-random jitter $\delta(A, B) \sim \mathcal{U}(-1.5\text{ km}, +1.5\text{ km})$ seeded by `hash(UserA_ID + UserB_ID)` so the distance remains consistent between the pair but cannot be triangulated across third parties.

### 2.2 Attribute Probing (Oracle) Attacks
- **The Attack:** An adversary wants to determine if User B has a secret sensitive trait (e.g. neurodivergence, specific religion). The adversary creates dummy profiles with targeted dealbreakers and tests whether User B disappears from recommendations.
- **Defense Mechanism:**
  1. Candidates are served in batched recommendation windows, not instant live index lookups.
  2. Private dealbreakers report generic non-leaking categorisations (*"Domestic boundary criteria not met"*).
  3. Sensitive Tier 4 attributes require mutual disclosure permissions before participating in discovery.

---

## 3. Cryptographic Storage & Key Lifecycle

1. **In-Transit:** Mandatory TLS 1.3 with HSTS and certificate pinning on mobile clients.
2. **At-Rest:** Database volumes encrypted via AES-256-XTS.
3. **Application-Layer Field-Level Encryption (FLE):** Tier 4 sensitive attributes (sexual health, sensitive accessibility disclosures) are encrypted in PostgreSQL using AES-256-GCM. Data Encryption Keys (DEKs) are rotated annually and managed in a dedicated Hardware Security Module (Cloud KMS/HSM).
4. **Secret Management:** Strictly zero hardcoded secrets. Environment variables injected via secret managers at container runtime.
