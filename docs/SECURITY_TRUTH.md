# CHECK — SECURITY & PRIVACY TRUTH
**Files Inspected**: `server/src/security/encryption.ts`, `server/src/index.ts`, `server/src/routes/*.ts`
**Status**: Verified Security Baseline & Vulnerability Registry
**Epistemic Standard**: `[VERIFIED FACT]`

---

## 1. Security Baseline & Cryptographic Implementation `[VERIFIED FACT]`

### Field-Level Encryption (FLE)
Implemented in `server/src/security/encryption.ts`:
- **Algorithm**: `aes-256-gcm` (Authenticated Encryption with Associated Data).
- **IV Length**: 12 bytes (96 bits), randomly generated per encryption via `crypto.randomBytes(12)`.
- **Authentication Tag**: 16 bytes (128 bits), verified during decryption via `decipher.setAuthTag(tag)`.
- **Key Requirement**: 256-bit (32-byte) binary key derived from a hex string.

---

## 2. Identified Vulnerabilities & Remediation Requirements `[VERIFIED FACT]`

### P0-1: Fallback Encryption Key Vulnerability
- **Location**: `server/src/security/encryption.ts`, lines 31–34.
- **Vulnerability**: If `FIELD_ENCRYPTION_KEY` is not set in the environment, the service silently falls back to generating a key from a hardcoded deterministic string: `crypto.createHash('sha256').update('universal_compatibility_tier4_dek_salt_2026').digest()`.
- **Impact**: In production, if `FIELD_ENCRYPTION_KEY` is omitted, all sensitive Tier 4 attributes will be encrypted using a public, known key.
- **Remediation Specification**: Throw an explicit fail-fast error when `process.env.NODE_ENV === 'production'` and `FIELD_ENCRYPTION_KEY` is missing or invalid.

### P0-2: Unauthenticated Identity & IDOR Risks
- **Location**: `server/src/routes/matching.ts`, `server/src/routes/profile.ts`, `server/src/routes/preferences.ts`.
- **Vulnerability**: Endpoints rely on user IDs passed directly in query strings (`?userId=...`) or request bodies (`{ userAId, userBId }`) without validating session authentication headers or tokens.
- **Impact**: Any user or client can inspect or request match calculations and recommendations for arbitrary user IDs.
- **Remediation Specification**: Introduce session-derived identity middleware that derives `currentUserId` from authenticated session/bearer tokens.

### P0-3: Wildcard CORS Configuration
- **Location**: `server/src/index.ts`, line 29.
- **Vulnerability**: `app.use(cors())` enables permissive cross-origin requests from any origin without restriction.
- **Impact**: Exposes API endpoints to cross-site request forgery and data extraction from unauthorized browser contexts.
- **Remediation Specification**: Restrict CORS origins to explicitly configured domain whitelists and enforce strict header policies.

---

## 3. Privacy Boundary & Anti-Trilateration Policy `[VERIFIED FACT]`

- **Exact Location Leakage**: Recommendations must never expose exact raw latitude and longitude coordinates of candidate profiles to client interfaces.
- **Distance Coarsening**: Geolocation data must be coarsened into discrete distance bands (e.g., `< 5 km`, `5–15 km`, `15–30 km`) or fuzzed with random noise ($\ge 1.5 \text{ km}$) to prevent location trilateration attacks.
