# SAFETY_SPEC.md — Safety Architecture, Moderation & Anti-Abuse

**Document Version:** 1.0.0  
**Status:** Canonical Safety & Moderation Specification  
**Governing Standard:** Master Build Specification §20, §34, §35  

---

## 1. Safety Principles & Constitutional Boundaries

1. **Symmetric Blocking (Immediate Erasure):** If User A blocks User B, all mutual records, messages, and recommendation appearances are severed immediately and reciprocally. Neither user is ever notified of the block.
2. **Human-in-the-Loop Moderation:** No automated AI moderation system is permitted to permanently ban or restrict users without verifiable human review and an open appeal mechanism (Spec §20).
3. **No Algorithmic Shadowbanning:** The platform never secretly depresses visibility or simulates non-existent user interactions. Disciplinary actions are transparently communicated.
4. **Proactive Fraud & Abuse Guardrails:** Behavioral signals (abnormal copy-paste messaging frequency, sudden rapid geo-jumping, financial keyword patterns) trigger soft-gating and human safety reviews.

---

## 2. Blocking & Reporting Architecture

### 2.1 Symmetric Severance Pipeline
When User A invokes `POST /api/v1/safety/block`:
1. Row inserted into `blocks(blocker_id = A, blocked_id = B)`.
2. Active connection in `matches` updated to `state = 'severed'`.
3. Cached records in `compatibility_evaluations` invalidated.
4. Stage 1 Inverted Filter immediately registers candidate exclusion: $\mathcal{G}_{\text{block}}(A, B) = 0$.

### 2.2 Reporting & Triage Pipeline
When a report is filed:
1. An auditable report record is created in `reports` with snapshot evidence (e.g. recent chat messages, report reason code).
2. Automated risk scoring assigns priority (High: physical safety/harassment; Medium: impersonation; Low: spam).
3. Assigned to human trust & safety moderation queue.
4. All actions (warning, temporary suspension, dismissal) require moderator identification and generate immutable `audit_logs` entries.

---

## 3. Trust & Verification Architecture (Spec §39)

The platform supports a 3-tier progressive verification ladder:

1. **Tier 1: Device & Email/SMS Verification:** Standard WebAuthn / Passkey / SMS OTP verification confirming single-device authenticity.
2. **Tier 2: Authenticated Liveness Photo Verification:** Real-time 3D pose verification matching selfie geometry against profile photographs. Completed locally or via zero-retention verification providers. Successful verification issues a cryptographic `photo_verified = true` badge.
3. **Tier 3: Cryptographic ID / Age Verification:** Privacy-preserving zero-knowledge age verification (confirming 18+ status and authentic identity without storing government ID document images).
