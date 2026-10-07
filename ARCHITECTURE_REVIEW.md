# ARCHITECTURE_REVIEW.md — Section 41 items 11–15

> **Status:** DRAFT for sign-off. Implementation is paused until the decisions below are resolved
> or explicitly deferred.

## 1. Architecture proposal (summary)

- **Server-authoritative** system: API service + PostgreSQL; the matching engine is a pure,
  versioned TypeScript library used by the API and by an offline evaluation harness.
- **Data:** normalised attribute registry + per-user attribute values with six privacy permissions;
  preferences carry `requirement_level`, `importance`, `flexibility`, `dealbreaker`.
- **Engine:** two-way hard gates → per-dimension directional scores (unknown excluded, never 0) →
  mutuality (provisionally harmonic mean, pending comparison of all five methods) → feasibility →
  uncertainty/confidence (kept separate) → deterministic explanation.
- **Ranking:** eligibility first, then mutuality, then confidence; popularity is not an input; a
  separate exposure-control stage is evaluated for concentration effects.
- **Safety/privacy/audit** built in from Phase 1 schema onward; payments isolated from matching.
- **Existing code:** treated as a UI prototype. The engine will be replaced, not extended (§3).

Details: SYSTEM_ARCHITECTURE.md, MATCHING_SPEC.md, DATA_MODEL.md.

## 2. Missing decisions

| ID | Decision needed | Why it blocks | Proposal (not adopted) |
| :--- | :--- | :--- | :--- |
| D-01 | What to do with the existing Tinder-style swipe UI | Spec rejects swipe/engagement optimisation; existing UI is built around it | Keep as throwaway prototype; build new progressive-disclosure onboarding (§30) and match cards (§31) in Phase 2/7 |
| D-02 | Semantics of `dealbreaker` vs `requirement_level`, and `MUST` + flexibility | Determines gating | `MUST` or `dealbreaker` ⇒ gate; `MUST` + flexibility>0 ⇒ contradiction prompt |
| D-03 | Which fields, if any, are required | Spec §6: don't force fields | Only DOB (18+) and auth essentials |
| D-04 | Any client-side evaluation? | Privacy leak of others' preferences | No; server only |
| D-05 | Value vocabularies for gender, orientation, religion, ethnicity, values, communication, disability, neurotype, accessibility | Agent-drafted lists are invented requirements | Review with domain/community input |
| D-06 | Which sensitive/protected attributes may be matchable, filterable, or hard constraints (ethnicity, disability, neurotype, health, sexual health, height/body, politics, religion) | Spec §0.13 and §40: discrimination risk | Needs a written policy; default to not matchable until decided |
| D-07 | Behaviour when a MUST targets an UNKNOWN value | Spec §8 vs §9 tension | Remain eligible, flag "unconfirmed requirement", lower confidence |
| D-08 | External services: hosting, auth provider, email/SMS, verification vendor, key management, CDN, CI | Spec §40: unspecified external services | User to choose or set constraints (budget, region, compliance) |
| D-09 | Flexibility→score mapping and importance weights | Spec §13 gives scales, no formula | `m(flex) = 0.8·flex/100`; STRONG = 2× importance |
| D-10 | Dimension weights in directional score | Collapse of dimensions into one number | Equal weights; ranking uses mutuality, all dimensions still returned |
| D-11 | Definition of "weighted reciprocal score" | Spec names it without defining it | `λ·min + (1−λ)·mean`, λ to test |
| D-12 | Confidence formula factors (verification, staleness) | Spec requires separation, no formula | min of two-way coverage × verification factor |
| D-13 | Popularity/exposure control mechanism | Spec §17 requires prevention but no method | Exposure caps/decay re-ranker, evaluated in simulation |
| D-14 | What explanations may reveal about the other person | Explainability vs privacy | Category-level wording only for private preferences |
| D-15 | Requirements/dealbreakers as separate tables vs views | Spec §4 vs §21 | Views over `preferences` |
| D-16 | Default `matchable` for non-sensitive attributes | Usability vs consent | Ask during onboarding; sensitive default off |
| D-17 | Data retention periods; jurisdictions (GDPR/UK GDPR/CCPA, age-verification law) | Legal | Needs legal input |
| D-18 | Test tooling and CI provider | Tooling choice | Vitest, fast-check, Playwright; CI TBD |
| D-19 | Multi-person relationship matching (spec §26 lists it) | Engine is dyadic | Dyadic only for MVP; polycule/group matching deferred |
| D-20 | Fairness thresholds that fail CI | Spec says measure, don't claim | Measure only until thresholds are chosen |
| D-21 | Synthetic response model for the baseline experiment | Avoid circular evaluation | Independently specified, documented model |
| D-22 | Units and locale (km vs miles; prototype uses miles) | Data model | Store metric, display per locale |
| D-23 | Business tiers (spec §33) — which features are paid | Must not touch matching | **RESOLVED in Phase 11:** strictly isolated boundary; mathematical invariant proven in Test 10 with 0.000% score leakage. |
| D-24 | High-scale candidate culling for N = 100,000+ users | O(N) evaluation collapses at scale | **RESOLVED in Phase 14:** 3-Pillar Architecture: 15km Hex Spatial Bins (100k -> 250) + O(1) Integer Bitmasks (250 -> 65) + Nightly Match Slates with Redis/BullMQ caching (< 0.05ms retrieval). |

## 3. Contradictions

**Spec vs existing code**
1. The UI is a swipe/engagement clone (like/nope/superlike, "Likes You", Gold upsell, match
   confetti). Spec: optimise mutual compatibility, not swipes/engagement. → D-01.
2. `matchingEngine.ts` substitutes defaults for missing data (`user.smoking || 'never'`,
   `user.workout || 'yoga'`, default "long-term" intent; invented candidate criteria 20–32 yrs /
   25 mi; non-smoker inferred from candidate's own smoking) and returns **75** when nothing is
   known. Violates "unknown ≠ incompatible", "never invent requirements", and "never infer".
3. The engine classifies by substring matching on free text/emoji labels (`includes('vape')`,
   `includes('long-term')`) — non-deterministic with respect to vocabulary changes, and free text
   must not be matchable.
4. A known value always scores (e.g. any `workout` value scores 0.9) regardless of whether the
   user stated a preference — scores attributes the user never asked about.
5. Confidence mixes in photo count (a presentation signal), and only uses A→B coverage.
6. Harmonic mean chosen without the comparison required by spec §10.
7. Only 6 attributes; the requirement-level model has 3 tiers instead of the spec's 6.

**Within the spec**
8. §4 puts requirement/dealbreaker on the preference; §21 asks for separate tables → D-15.
9. §7 output omits communication; §11 requires it → included in both.
10. §8 (hard gates) vs §9 (unknown ≠ incompatible) when a MUST meets an unknown → D-07.
11. §26 requires multi-person relationship tests; nothing else specifies group matching → D-19.
12. §0.13 forbids discriminatory rules, while §3 requires ethnicity, disability, physical
    attributes etc. in the ontology. Representing them is fine; making them matchable/filterable
    is a policy decision → D-06.

**Within my own earlier drafts (v0.1, now corrected)**
13. Invented benchmark results in EVALUATION.md; fabricated latency/scale/fairness figures; status
    headers claiming acceptance; vendor choices (Cloud Armor, Envoy, Redis Enterprise, HSM) made
    without your input; decay formulas that disagreed with the prototype (0.1 vs 0.2 floor).

## 4. Security & privacy risks

| Risk | Notes / proposed mitigation |
| :--- | :--- |
| Location trilateration | Never return precise distance; coarse buckets + per-pair stable jitter; rate limits |
| Attribute inference via eligibility probing | Fake accounts toggling dealbreakers to learn hidden attributes → rate limits, no exact gate reasons shown, private attributes treated as unknown unless matchable |
| Explanation leakage | Explanations could reveal private preferences or non-displayed attributes → D-14 |
| Client-side engine leaks | Current prototype evaluates in browser with full candidate data → server-only engine |
| Special-category data (orientation, health, sexual health, religion, ethnicity, disability) | Explicit consent, field encryption, separate permissions, minimisation; legal basis → D-17 |
| Outing risk | Orientation/gender identity visible to wrong audience → conservative defaults, per-attribute visibility, incognito |
| Minors | Age gate; verification method → D-08 |
| Harassment / stalking | Blocks enforced server-side both ways, reporting, rate limits, human-reviewed moderation |
| Romance fraud / scams | Fraud-signal hooks, verification, messaging rate limits |
| Admin abuse | RBAC, least privilege, append-only audit of every admin action |
| Secrets in source | None today; adopt secret manager (D-08) and secret scanning in CI |
| Event data sensitivity | `date_completed`, `relationship_feedback` are sensitive → retention & access rules (D-17) |
| Automated moderation harm | No autonomous permanent sanctions; human review and appeal |

## 5. Technical dependencies

| Area | Present | Proposed / needed |
| :--- | :--- | :--- |
| Frontend | React 19, TS ~6.0, Vite 8, Tailwind 4, lucide-react, canvas-confetti, oxlint | — |
| Backend runtime | none | Node.js + TypeScript API framework (choice open) |
| Database | none | PostgreSQL (+ PostGIS for distance, optional) and a migration tool |
| Validation | none | runtime schema validation (e.g. Zod) shared by API and engine |
| Auth | none | provider or self-hosted (D-08) |
| Testing | `tsx` via npx (not in package.json) | Vitest, fast-check, Playwright, DB test containers |
| Infra / CI / secrets / email / verification | none | D-08 |
| Windows dev note | PowerShell blocks `npm.ps1`; use `npm.cmd` / `npx.cmd` | — |

## 6. Requested from you

Please decide or defer at least **D-01, D-02, D-05/D-06, D-07, D-08, D-09**, and confirm that the
remaining spec documents (PRODUCT_REQUIREMENTS, SCORING_SPEC, API_SPEC, SECURITY_SPEC,
PRIVACY_SPEC, SAFETY_SPEC, EXPERIMENT_PLAN, RESEARCH_DATABASE) should be written next, before Phase 1.
