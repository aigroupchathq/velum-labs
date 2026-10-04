# ATTRIBUTE_DICTIONARY.md

> **Status:** DRAFT v0.2 — not accepted. The schema (§1–§4) follows master prompt §4–§5 and §19.
> The seed registry (§6) is an **agent-drafted starting point**; every value list and every
> `matchable` / `hard_constraint_capable` flag on a sensitive attribute is pending review
> (ARCHITECTURE_REVIEW.md D-05, D-06).

## 1. Attribute definition schema (spec §4)

| Field | Type | Notes |
| :--- | :--- | :--- |
| `id` | string, snake_case, immutable | e.g. `diet` |
| `name` | string | user-facing label (localisable) |
| `category` | int 1–48 | ONTOLOGY.md |
| `description` | string | |
| `value_type` | enum | `boolean`, `single_select`, `multi_select`, `integer`, `decimal`, `range`, `ordinal`, `geo_point`, `schedule`, `language_proficiency_list`, `free_text` |
| `allowed_values` | list / bounds / null | closed vocabulary where possible; free text is never matchable |
| `user_visible` | bool | attribute appears in the profile UI at all |
| `required` | bool | **default false**; only account essentials (see §5) |
| `optional` | bool | inverse of `required`, kept explicit per spec |
| `sensitive` | bool | special-category-like data; extra consent |
| `highly_sensitive` | bool | health, sexual health, etc.; encrypted at rest; never searchable by default |
| `searchable` | bool | *capability*: may appear in search UI |
| `filterable` | bool | *capability*: may be used as a filter |
| `matchable` | bool | *capability*: engine may read it |
| `hard_constraint_capable` | bool | may be targeted by a `MUST` / dealbreaker |
| `preference_capable` | bool | may be targeted by a preference |
| `weightable` | bool | preference importance 1–5 applies |
| `privacy_level` | enum | default visibility: `private`, `matches_only`, `members`, `public` |
| `verification_possible` | bool | can the platform verify it (e.g. photo, age) |
| `source` | enum | `self_declared`, `verified`, `system_derived` |
| `confidence` | enum/number | how reliable values from this source are; self-declared ≠ verified |
| `created_at`, `updated_at` | timestamp | |

Capability flags say what the platform **may** do. What it **does** for a given user is decided
by that user's per-attribute permissions (§4). Capability ≠ consent.

## 2. User preference schema (spec §4, §13)

| Field | Type | Meaning |
| :--- | :--- | :--- |
| `attribute_id` | fk | which attribute the preference targets |
| `value` | typed | target value(s) / range |
| `importance` | int 1–5 | weight; ignored for `MUST` and `NEUTRAL` |
| `requirement_level` | enum | see §3 |
| `flexibility` | int 0–100 | willingness to compromise; 0 = none, 100 = fully flexible |
| `dealbreaker` | bool | explicit exclusion flag |
| `privacy_setting` | enum | whether the preference itself can be shown to others (default `private`) |

## 3. Requirement levels

| Level | Engine behaviour (detail in MATCHING_SPEC §4) |
| :--- | :--- |
| `MUST` | Hard constraint → eligibility gate, if the attribute is `hard_constraint_capable` |
| `STRONG_PREFERENCE` | Scored, high weight |
| `PREFERENCE` | Scored, normal weight |
| `NEUTRAL` | Not scored ("I don't care") |
| `AVOID` | Scored inversely; becomes a gate only if `dealbreaker = true` |
| `UNKNOWN` | User has not stated a preference; not scored; counts toward uncertainty |

**[OPEN D-02]** How `dealbreaker` relates to `requirement_level`. Spec §4 lists them as separate
fields, so combinations like `PREFERENCE + dealbreaker=true` or `MUST + flexibility=70` are
possible. Proposed rule: `dealbreaker=true` or `MUST` ⇒ gate; `MUST` with `flexibility > 0` ⇒
flag `PREFERENCE_CONTRADICTION` and ask the user. Not adopted until confirmed.

## 4. Per-user, per-attribute permissions (spec §19)

Six independent permissions for each sensitive attribute value:

| Permission | Meaning |
| :--- | :--- |
| `store` | the platform may keep the value at all |
| `display` | may be shown on the profile (to `privacy_level` audience) |
| `searchable` | others may find the user by it |
| `matchable` | the engine may use it |
| `private` | visible to the user only (overrides display) |
| `verified` | status of verification (system-set, not a user toggle) |

A user may disclose an attribute (`display = true`) without allowing discovery
(`searchable = false`, `matchable = false`). When `matchable = false`, the engine treats the value
as **UNKNOWN** for everyone else's evaluation and must not leak it through explanations.

## 5. The critical distinction (spec §5)

| Statement | Record |
| :--- | :--- |
| "I am vegetarian." | `attribute_values(diet = vegetarian)` on self |
| "I prefer vegetarian partners." | `preferences(diet ∈ {vegetarian}, PREFERENCE, importance n)` |
| "I require vegetarian partners." | `preferences(diet ∈ {vegetarian}, MUST)` (+ optionally `dealbreaker`) |
| "I don't care whether my partner is vegetarian." | `preferences(diet, NEUTRAL)` |
| "I am willing to compromise." | `flexibility` on the preference (e.g. 70) |
| (no statement) | no preference row → `UNKNOWN` |

Required account fields (proposed, **[OPEN D-03]**): date of birth (for age eligibility / 18+),
and whatever the chosen auth method needs. Nothing else is required.

## 6. Seed registry (draft)

Unless stated otherwise: `user_visible=true`, `required=false`, `optional=true`, `source=self_declared`,
`searchable=false`, `filterable=false`, `privacy_level=matches_only`. **S** = sensitive,
**HS** = highly sensitive, **M** = matchable, **H** = hard_constraint_capable, **P** = preference_capable,
**W** = weightable, **V** = verification_possible. `?` = pending policy decision D-06.

| id | cat | value_type | allowed_values (draft) | S | HS | M | H | P | W | V |
| :--- | :--- | :--- | :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| `date_of_birth` | 01 | date | ≥ 18 years | | | ✓ | ✓ | ✓ | ✓ | ✓ |
| `pronouns` | 01 | multi_select + custom | she, he, they, custom | | | | | | | |
| `gender_identity` | 02 | multi_select + custom | woman, man, non-binary, trans woman, trans man, genderfluid, agender, two-spirit, custom | S | | ✓ | ✓ | ✓ | | |
| `genders_sought` | 02 | multi_select | same vocabulary as above | S | | ✓ | ✓ | — | | |
| `sexual_orientation` | 03 | multi_select + custom | straight, gay, lesbian, bisexual, pansexual, asexual, demisexual, queer, questioning, custom | S | | ? | ? | ? | | |
| `romantic_orientation` | 04 | multi_select + custom | heteroromantic, homoromantic, biromantic, panromantic, aromantic, demiromantic, custom | S | | ? | ? | ? | | |
| `attraction_importance` | 05 | object (6 × 1–5) | physical, emotional, intellectual, romantic, sexual, social | | | ✓ | | ✓ | ✓ | |
| `relationship_intention` | 06 | multi_select | long-term, marriage, short-term, casual, friendship, figuring it out | | | ✓ | ✓ | ✓ | ✓ | |
| `relationship_structure` | 07 | single_select | monogamous, open, polyamorous, relationship anarchy, other, unsure | | | ✓ | ✓ | ✓ | ✓ | |
| `has_children` | 09 | single_select | none, yes-live-with-me, yes-part-time, yes-don't-live-with-me | | | ✓ | ? | ✓ | ✓ | |
| `wants_children` | 09 | single_select | definitely, probably, unsure, probably not, definitely not | | | ✓ | ✓ | ✓ | ✓ | |
| `religion` | 10 | single_select + custom | (vocabulary pending review) | S | | ✓ | ? | ✓ | ✓ | |
| `religious_practice` | 10 | ordinal 1–5 | not practising → very observant | S | | ✓ | ? | ✓ | ✓ | |
| `ethnicity` | 13 | multi_select + custom | (vocabulary pending review) | S | | **?** | **?** | **?** | | |
| `languages` | 14 | language_proficiency_list | ISO 639 + proficiency | | | ✓ | ✓ | ✓ | ✓ | |
| `core_values` | 15 | multi_select (max N) | (vocabulary pending review) | | | ✓ | | ✓ | ✓ | |
| `communication_style` | 17 | single_select | (vocabulary pending review) | | | ✓ | | ✓ | ✓ | |
| `smoking` | 18 | single_select | never, socially, regularly, trying to quit | | | ✓ | ✓ | ✓ | ✓ | |
| `alcohol` | 18 | single_select | never, rarely, socially, regularly | | | ✓ | ✓ | ✓ | ✓ | |
| `diet` | 20 | single_select | omnivore, vegetarian, vegan, pescatarian, other | | | ✓ | ✓ | ✓ | ✓ | |
| `accessibility_needs` | 23 | multi_select | (vocabulary pending review) | S | | ? | | ? | | |
| `disability` | 24 | multi_select + custom | (vocabulary pending review) | S | HS | **?** | **?** | **?** | | |
| `neurotype` | 25 | multi_select + custom | (vocabulary pending review) | S | HS | **?** | **?** | **?** | | |
| `height_cm` | 26 | integer | 100–250 | | | ? | ? | ? | ? | |
| `sexual_health_disclosure` | 22 | (pending) | (pending) | S | HS | **?** | **?** | **?** | | |
| `location` | 30 | geo_point | stored precise, exposed coarse | S | | ✓ | ✓ | ✓ | ✓ | |
| `max_distance_km` | 30 | integer | 1–20,000 | | | ✓ | ✓ | — | | |
| `open_to_relocation` | 31 | single_select | no, maybe, yes | | | ✓ | | ✓ | ✓ | |
| `open_to_long_distance` | 31 | single_select | no, maybe, yes | | | ✓ | ✓ | ✓ | ✓ | |
| `time_zone` | 32 | IANA tz | | | | ✓ | | ✓ | ✓ | |
| `weekly_availability` | 32 | schedule | | | | ✓ | | ✓ | ✓ | |
| `pets` | 34 | multi_select | (vocabulary pending review) | | | ✓ | ✓ | ✓ | ✓ | |
| `pet_allergy` | 34 | multi_select | (vocabulary pending review) | S | | ✓ | ✓ | | | |
| `politics` | 35 | single_select | (vocabulary pending review) | S | | ? | ? | ? | ? | |
| `belief_system_optin` | 36 | object | astrology / other user-selected; opt-in only | | | ✓ (opt-in) | | ✓ | ✓ | |
| `photo_verified` | 39 | boolean | system-set | | | ✓ | ✓ | ✓ | | ✓ |
| `bio` | 01 | free_text | | | | ✗ | ✗ | ✗ | ✗ | |

Decay curves and per-type scoring functions are defined in MATCHING_SPEC §5, not here.
