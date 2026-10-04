# Universal Compatibility & Matching Platform: Attribute Dictionary
**Document Version:** 1.0.0  
**Status:** Canonical Machine-Readable & Human-Readable Attribute Registry  
**Governing Standard:** Section 4 of Master Build Specification  

---

## 1. Registry Schema Specification

Every attribute admitted into the Universal Compatibility & Matching Platform must strictly adhere to the following schema definition:

| Field | Type | Description |
| :--- | :--- | :--- |
| `attribute_id` | `String` (snake_case) | Unique immutable platform identifier. |
| `category_id` | `Integer` (01–48) | Mapping to the 48 Ontological Categories in `ONTOLOGY.md`. |
| `display_name` | `String` | User-facing localized title. |
| `data_type` | `Enum` | `boolean`, `categorical`, `multi_select`, `scalar`, `ordinal`, `geographic`, `schedule`. |
| `allowed_values` | `Array<String>` / `Range` | Closed set of valid discrete values or numeric boundary. |
| `privacy_tier` | `Enum` | `public` (Tier 1), `match_only` (Tier 2), `reciprocal` (Tier 3), `encrypted` (Tier 4). |
| `matchable` | `Boolean` | Whether this attribute can be evaluated by the deterministic matching engine. |
| `dealbreaker_capable` | `Boolean` | Whether a user may designate this attribute as a hard exclusionary criterion. |
| `mutuality_type` | `Enum` | `symmetric` (value congruence), `complementary` (synergistic opposites), `directional` (unilateral desire). |
| `default_weight` | `Integer` (1–5) | Default algorithmic importance (1 = low, 3 = standard, 5 = critical). |
| `decay_curve` | `Enum` | `step` (discrete cutoff), `linear`, `exponential`, `sigmoid`, `none`. |

---

## 2. Core Attribute Registry

### Domain A: Identity, Orientation & Attraction

| Attribute ID | Cat | Display Name | Data Type | Allowed Values / Range | Privacy | Matchable | Dealbreaker | Mutuality | Weight | Decay |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `ident_pronouns` | 01 | Pronouns | `categorical` | `she_her`, `he_him`, `they_them`, `she_they`, `he_they`, `neopronouns`, `custom` | public | No | No | directional | 1 | none |
| `gender_self_id` | 02 | Gender Identity | `categorical` | `cis_woman`, `cis_man`, `trans_woman`, `trans_man`, `non_binary`, `genderfluid`, `agender`, `two_spirit`, `intersex`, `other` | public | Yes | Yes | directional | 5 | step |
| `orient_sexual` | 03 | Sexual Orientation | `categorical` | `heterosexual`, `homosexual`, `bisexual`, `pansexual`, `asexual`, `demisexual`, `graysexual`, `queer`, `questioning` | public | Yes | Yes | directional | 5 | step |
| `orient_romantic` | 04 | Romantic Orientation | `categorical` | `alloromantic`, `aromantic`, `biromantic`, `panromantic`, `demiromantic`, `homoromantic`, `heteroromantic` | public | Yes | Yes | directional | 4 | step |
| `attract_modes` | 05 | Attraction Drivers | `multi_select` | `intellectual`, `emotional`, `aesthetic`, `physical`, `auditory_voice`, `sensory_tactile`, `spiritual_energy` | match_only | Yes | No | symmetric | 3 | linear |
| `phys_height_cm` | 26 | Height (cm) | `scalar` | `[100, 250]` | public | Yes | Yes | directional | 2 | sigmoid |
| `phys_body_type` | 26 | Body Type | `categorical` | `lean`, `athletic`, `average`, `curvy`, `plus_size`, `muscular`, `undisclosed` | public | Yes | No | directional | 1 | step |

---

### Domain B: Relational Intent & Structure

| Attribute ID | Cat | Display Name | Data Type | Allowed Values / Range | Privacy | Matchable | Dealbreaker | Mutuality | Weight | Decay |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `rel_intent_type` | 06 | Primary Relationship Intention | `categorical` | `long_term_marriage`, `long_term_exploratory`, `short_term_dating`, `casual_companionship`, `platonic_life_partner`, `shared_domesticity`, `intentional_discovery` | public | Yes | Yes | symmetric | 5 | step |
| `rel_structure_type`| 07 | Relationship Structure | `categorical` | `monogamous`, `monogamish`, `enm_open`, `polyamorous_hierarchical`, `polyamorous_non_hierarchical`, `solo_poly`, `poly_flexible` | public | Yes | Yes | symmetric | 5 | step |
| `sex_libido_pace` | 08 | Intimacy Cadence | `ordinal` | `1_non_sexual`, `2_occasional`, `3_moderate`, `4_frequent_daily`, `5_context_dependent` | reciprocal | Yes | No | symmetric | 4 | linear |
| `sex_kink_alignment`| 08 | Kink / BDSM Orientation | `categorical` | `strictly_vanilla`, `curious_exploring`, `moderate_kink`, `lifestyle_experienced`, `24_7_power_exchange` | reciprocal | Yes | Yes | complementary| 4 | step |
| `fam_has_children` | 09 | Existing Children | `categorical` | `no_children`, `has_minor_custodial`, `has_minor_shared`, `has_adult_children` | public | Yes | Yes | directional | 4 | step |
| `fam_wants_children`| 09 | Future Children Desire | `ordinal` | `definite_never`, `leaning_never`, `uncertain_open`, `leaning_yes`, `definite_yes` | public | Yes | Yes | symmetric | 5 | step |

---

### Domain C: Culture, Values & Philosophy

| Attribute ID | Cat | Display Name | Data Type | Allowed Values / Range | Privacy | Matchable | Dealbreaker | Mutuality | Weight | Decay |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `cult_religion_trad`| 10 | Religious / Faith Tradition | `categorical` | `atheist`, `agnostic`, `protestant`, `catholic`, `orthodox_christian`, `jewish`, `muslim`, `hindu`, `buddhist`, `sikh`, `spiritual_not_religious`, `pagan_earth`, `interfaith` | public | Yes | Yes | symmetric | 3 | step |
| `cult_relig_observ` | 10 | Religious Observance Intensity | `ordinal` | `1_cultural_secular`, `2_infrequent`, `3_moderate_holiday`, `4_regular_weekly`, `5_strict_daily` | public | Yes | Yes | symmetric | 3 | linear |
| `phil_worldview` | 11 | Epistemological Worldview | `categorical` | `scientific_rationalism`, `existential_humanism`, `traditional_orthodox`, `postmodern_relativist`, `spiritual_holistic`, `stoic_pragmatic` | match_only | Yes | No | symmetric | 3 | linear |
| `lang_spoken_codes` | 14 | Spoken Languages | `multi_select` | ISO-639-1 code list (`en`, `es`, `fr`, `de`, `zh`, `ja`, `ar`, `hi`, `pt`, `it`, `asl`, etc.) | public | Yes | Yes | complementary| 5 | step |
| `val_core_ranking` | 15 | Primary Core Values | `multi_select` | `integrity`, `compassion`, `autonomy`, `growth`, `family`, `community`, `security`, `creativity`, `justice`, `curiosity`, `loyalty` | match_only | Yes | No | symmetric | 4 | linear |
| `fin_spending_style`| 29 | Financial Spending Philosophy | `categorical` | `frugal_accumulator`, `balanced_conscious`, `experiential_spender`, `high_luxury_spender` | match_only | Yes | No | symmetric | 3 | linear |
| `pol_civic_spectrum`| 35 | Political / Civic Orientation | `categorical` | `progressive_left`, `liberal_democrat`, `centrist_independent`, `libertarian`, `conservative_right`, `apolitical_detached`, `democratic_socialist`, `anarchist` | match_only | Yes | Yes | symmetric | 4 | step |
| `esot_belief_optin` | 36 | Esoteric System Opt-in | `boolean` | `true`, `false` | match_only | Yes | No | symmetric | 1 | none |

---

### Domain D: Cognition, Health & Accessibility

| Attribute ID | Cat | Display Name | Data Type | Allowed Values / Range | Privacy | Matchable | Dealbreaker | Mutuality | Weight | Decay |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `psy_ocean_openness`| 16 | Openness to Experience | `scalar` | `[0, 100]` | match_only | Yes | No | symmetric | 2 | linear |
| `psy_ocean_consc` | 16 | Conscientiousness | `scalar` | `[0, 100]` | match_only | Yes | No | symmetric | 3 | linear |
| `psy_ocean_extra` | 16 | Extraversion | `scalar` | `[0, 100]` | match_only | Yes | No | complementary| 2 | linear |
| `psy_ocean_agree` | 16 | Agreeableness | `scalar` | `[0, 100]` | match_only | Yes | No | symmetric | 4 | linear |
| `psy_ocean_neuro` | 16 | Emotional Sensitivity | `scalar` | `[0, 100]` | match_only | Yes | No | complementary| 3 | linear |
| `comm_conflict_res` | 17 | Conflict Resolution Style | `categorical` | `direct_immediate`, `reflective_deliberate`, `cool_off_space_first`, `diplomatic_gentle` | match_only | Yes | No | complementary| 4 | step |
| `comm_digital_pace` | 17 | Text / Digital Cadence | `categorical` | `frequent_all_day`, `regular_intervals`, `end_of_day_batch`, `minimal_in_person_only` | match_only | Yes | No | symmetric | 3 | step |
| `hlth_sleep_chrono` | 21 | Sleep Chronotype | `categorical` | `morning_lark`, `intermediate_flexible`, `night_owl` | public | Yes | No | symmetric | 2 | step |
| `hlth_sti_test_rec` | 22 | STI Screening Verification | `categorical` | `tested_last_3_months`, `tested_last_6_months`, `tested_last_year`, `regular_routine`, `untested` | encrypted | Yes | Yes | symmetric | 4 | step |
| `acc_step_free` | 23 | Step-Free Mobility Required | `boolean` | `true`, `false` | public | Yes | Yes | complementary| 5 | step |
| `acc_sensory_calm` | 23 | Low Sensory Environment Needed | `boolean` | `true`, `false` | public | Yes | No | complementary| 3 | step |
| `nd_neurotype_tags` | 25 | Neurotype Identification | `multi_select` | `neurotypical`, `adhd`, `autistic`, `audhd`, `gifted_2e`, `sensory_processing`, `tourettes`, `dyspraxic`, `bipolar`, `other` | match_only | Yes | No | complementary| 3 | none |

---

### Domain E: Daily Life & Ecology

| Attribute ID | Cat | Display Name | Data Type | Allowed Values / Range | Privacy | Matchable | Dealbreaker | Mutuality | Weight | Decay |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `life_subst_tobacco`| 18 | Tobacco / Nicotine Usage | `categorical` | `never`, `socially_only`, `regular_daily`, `quitting_vaping` | public | Yes | Yes | symmetric | 4 | step |
| `life_subst_alcohol`| 18 | Alcohol Consumption | `categorical` | `sober_non_drinker`, `occasional_rare`, `moderate_weekly`, `frequent` | public | Yes | Yes | symmetric | 3 | linear |
| `life_subst_cannabis`| 18 | Cannabis Usage | `categorical` | `never`, `socially`, `medicinal`, `daily_regular` | public | Yes | Yes | symmetric | 3 | step |
| `life_clean_standard`| 18 | Domestic Tidiness Standard | `ordinal` | `1_minimal_clutter_free`, `2_tidy_structured`, `3_comfortable_lived_in`, `4_relaxed_clutter_tolerant` | match_only | Yes | No | symmetric | 3 | linear |
| `food_dietary_regime`| 20 | Primary Diet | `categorical` | `omnivore`, `vegetarian`, `vegan`, `pescatarian`, `kosher`, `halal`, `celiac_strict_gluten_free` | public | Yes | Yes | symmetric | 3 | step |
| `pet_cohabitation` | 34 | Animal Living Arrangements | `multi_select` | `lives_with_dogs`, `lives_with_cats`, `lives_with_other`, `pet_free_home`, `wants_pets_future` | public | Yes | Yes | symmetric | 4 | step |
| `pet_allergy_severe`| 34 | Severe Animal Allergies | `multi_select` | `allergy_cats`, `allergy_dogs`, `allergy_feathers`, `none` | public | Yes | Yes | complementary| 5 | step |

---

### Domain F: Spatio-Temporal Feasibility

| Attribute ID | Cat | Display Name | Data Type | Allowed Values / Range | Privacy | Matchable | Dealbreaker | Mutuality | Weight | Decay |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `geo_coordinates` | 30 | Geographic Geohash | `geographic` | Obfuscated Lat/Long (7-character Geohash, $\pm 1.5\text{km}$) | match_only | Yes | Yes | symmetric | 5 | sigmoid |
| `geo_max_dist_km` | 30 | Maximum Discovery Distance | `scalar` | `[1, 1000]` km | match_only | Yes | Yes | directional | 5 | exponential |
| `geo_dist_flex_km` | 44 | Distance Flexibility Radius | `scalar` | `[0, 250]` km | match_only | Yes | No | directional | 2 | linear |
| `time_sched_shift` | 32 | Work Schedule Shift | `categorical` | `standard_daytime`, `night_shift`, `rotating_shift`, `irregular_flexible`, `travel_heavy` | match_only | Yes | No | complementary| 2 | step |
| `time_avail_hours_wk`| 32 | Weekly Relationship Availability| `scalar` | `[1, 60]` hours/week | match_only | Yes | No | symmetric | 3 | linear |

---

## 3. Mathematical Decay Curve Formulations

Attributes with scalar or ordinal divergence utilize one of four explicit mathematical decay curves:

1. **Step Function (`step`):**
   $$f(\Delta) = \begin{cases} 1.0 & \text{if } \Delta = 0 \\ 0.0 & \text{if } \Delta > 0 \end{cases}$$
2. **Linear Decay with Flexibility Tolerance $\tau$ (`linear`):**
   $$f(\Delta, \tau) = \begin{cases} 1.0 & \text{if } \Delta \le \tau \\ \max\left(0.0, 1.0 - \frac{\Delta - \tau}{\text{MaxRange} - \tau}\right) & \text{if } \Delta > \tau \end{cases}$$
3. **Exponential Decay with Scale Parameter $\lambda$ (`exponential`):**
   $$f(\Delta, \tau) = \begin{cases} 1.0 & \text{if } \Delta \le \tau \\ e^{-\lambda (\Delta - \tau)} & \text{if } \Delta > \tau \end{cases}$$
4. **Sigmoid Soft-Drop (`sigmoid`):**
   $$f(x; x_0, k) = \frac{1}{1 + e^{k (x - x_0)}}$$
   *(Applied where $x_0$ is the cutoff threshold, and $k$ determines boundary steepness).*
