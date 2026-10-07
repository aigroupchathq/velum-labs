# API_SPEC.md — Universal Compatibility Platform API Specification

**Document Version:** 1.0.0  
**Status:** REST & JSON Contract Baseline  
**Base URL:** `/api/v1`  
**Governing Standard:** Master Build Specification §2, §7, §14–§17, §31–§35  

---

## 1. Authentication & Security Headers

All requests require bearer token authentication (except auth endpoints):
```http
Authorization: Bearer <session_jwt>
X-Client-Version: 1.0.0
X-Request-Id: <uuid_v4>
```

---

## 2. Profile & Progressive Disclosure Endpoints

### 2.1 `GET /api/v1/profile/me`
Retrieves the authenticated user's profile across all 6 progressive disclosure stages.

### 2.2 `PUT /api/v1/profile/stage/:stageNumber`
Updates a specific progressive disclosure stage ($1 \le \text{stageNumber} \le 6$):
- **Stage 1:** Basic Identity & Demographics (`pronouns`, `bio`, `dob`).
- **Stage 2:** Relationship Intention & Structure (`relationship_intention`, `relationship_structure`, `attraction_modes`).
- **Stage 3:** Weighted Preferences (`preferences` map with weights $1–5$).
- **Stage 4:** Hard Dealbreakers (`dealbreakers` list).
- **Stage 5:** Flexibility Tolerances (`flexibility` margins $0–100\%$).
- **Stage 6:** In-Depth Complementary Profiles (Communication, Chronotype, Sensory needs).

---

## 3. Matching & Recommendation Endpoints

### 3.1 `POST /api/v1/recommendations`
Fetches the curated list of mutually compatible candidates.

**Request Payload:**
```json
{
  "limit": 10,
  "cursor": null,
  "includeDiagnostics": false
}
```

**Response Payload (`200 OK`):**
```json
{
  "recommendations": [
    {
      "candidateId": "usr_99824",
      "profile": {
        "name": "Jordan",
        "age": 29,
        "location": "Central District",
        "distanceKm": 8.4,
        "verified": true,
        "relationshipIntention": "Long-Term Partnership / Marriage",
        "relationshipStructure": "Monogamous",
        "photos": ["https://..."]
      },
      "evaluation": {
        "eligible": true,
        "mutualScore": 88,
        "scoreAtoB": 91,
        "scoreBtoA": 85,
        "confidence": {
          "score": 92,
          "rating": "High",
          "knownRatio": 0.94
        },
        "strongAlignment": [
          "Identical relationship intention (Long-Term Partnership)",
          "Shared high valuation of intellectual curiosity & integrity",
          "Harmonious communication pacing"
        ],
        "potentialFriction": [
          "Slight chronotype divergence (Night owl vs Intermediate, within flexibility)"
        ],
        "unknowns": [
          "Pet cohabitation preferences"
        ],
        "geographicFeasibility": {
          "score": 95,
          "distanceKm": 8.4
        },
        "whyRecommended": "High mutual value alignment and shared vision for domestic partnership with compatible communication styles."
      }
    }
  ],
  "nextCursor": "cur_e83719"
}
```

### 3.2 `POST /api/v1/matching/evaluate`
Directly evaluates bidirectional compatibility between two designated profiles (used for transparency inspection and testing).

**Request Payload:**
```json
{
  "userAId": "usr_current",
  "userBId": "usr_target"
}
```

**Response Payload (`200 OK`):**
Full structured `MatchEvaluation` object conforming to `MATCHING_SPEC.md` §2.

---

## 4. Preference Optimization & Contradiction Detection

### 4.1 `GET /api/v1/preferences/contradictions`
Scans the current user's profile for logical preference contradictions (Spec §14).

**Response Payload (`200 OK`):**
```json
{
  "contradictionsFound": 1,
  "contradictions": [
    {
      "code": "DISTANCE_NEUTRAL_BUT_LIMITED",
      "severity": "WARNING",
      "message": "You indicated that distance is 'NEUTRAL' ('doesn't matter'), but you set a hard maximum distance of 10 km.",
      "fields": ["preferences.distance_neutral", "preferences.max_distance_km"],
      "suggestedFix": "Either set distance importance to Strong/Normal, or increase the maximum radius."
    }
  ]
}
```

### 4.2 `POST /api/v1/preferences/optimize`
Runs what-if simulation scenarios on relaxing candidate constraints (Spec §32).

**Request Payload:**
```json
{
  "proposedAdjustments": {
    "distanceKmDelta": 15,
    "ageFlexibilityDelta": 2
  }
}
```

**Response Payload (`200 OK`):**
```json
{
  "currentPoolSize": 120,
  "estimatedPoolSize": 380,
  "poolExpansionPercent": 216.6,
  "estimatedMutualCompatibilityImpact": -2.1,
  "disclaimer": "These numbers are simulated estimates based on active local population density and do not guarantee match outcomes."
}
```

---

## 5. Safety, Blocking & Reporting Endpoints

- `POST /api/v1/safety/block`: Immediately excludes target user symmetrically and removes all cached recommendations.
- `POST /api/v1/safety/report`: Files an auditable moderation ticket with structured reasons and evidence payload.
- `POST /api/v1/safety/privacy-permissions`: Updates per-attribute permissions (`store`, `display`, `searchable`, `matchable`, `private`).

---

## 6. Payments & Subscriptions Boundary Endpoints (Phase 11, Spec §33, Invariant D-23)

> **Architectural Invariant D-23:** Payments and subscription states are strictly isolated from matching. No paid tier may modify matching scores, eligibility, exposure, or candidate ranking.

### 6.1 `GET /api/v1/subscriptions/current`
Retrieves current user's active subscription status, ethical entitlements, localized pricing (`currency` query parameter: `USD`, `GBP`, `EUR`, `CAD`, `AUD`), and explicit isolation guarantees.

### 6.2 `GET /api/v1/subscriptions/features`
Returns non-matching feature allowances (e.g., What-If simulation quotas, dossier export permissions), supported regional currencies, and global localized pricing lookup matrix.

### 6.3 `POST /api/v1/subscriptions/checkout`
Initiates payment checkout session. Requires `idempotencyKey` to prevent duplicate billing. Accepts optional `currency` parameter (`USD` default, `GBP`, `EUR`, `CAD`, `AUD`) with statutory VAT/GST inclusions.

### 6.4 `POST /api/v1/subscriptions/webhook`
Processes provider payment notifications with HMAC SHA-256 signature verification and replay prevention. Preserves transaction currency in idempotent payment records.

### 6.5 `POST /api/v1/subscriptions/cancel`
Schedules subscription cancellation at the end of the billing period without penalty.

---

## 7. Container Orchestration & Health Probes (Phase 12)

- `GET /health/live`: Lightweight liveness probe for Kubernetes and Docker engine (`status: "live"`).
- `GET /health/ready`: Readiness probe verifying backend connectivity and deterministic engine status (`status: "ready"`).
- `GET /api/health`: Full service diagnostic check verifying deterministic and ML-free compliance.
