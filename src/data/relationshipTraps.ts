// ============================================================================
// src/data/relationshipTraps.ts
// Curated Relationship Decision Library: Traps, Boundary Triage & Mirror Logic
// Non-judgmental, psychologically grounded, human-centered decision support
// ============================================================================

import type {
  RelationshipTrap,
  BoundaryTriageItem,
  MirrorCheck,
  UniversalUserProfile,
  FrictionNotice,
} from '../types'

/**
 * Curated library of recurring dating traps that people actively work to break.
 * Phrased with dignity, psychological insight, and constructive clarity.
 */
export const DEFAULT_RELATIONSHIP_TRAPS: RelationshipTrap[] = [
  {
    id: 'trap_adrenaline_over_safety',
    title: 'Confusing Intensity with Long-Term Compatibility',
    category: 'attraction',
    summary: 'Drawn strongly to unpredictable, exciting energy while confusing anxiety or emotional ambiguity with love.',
    description: 'Drawn strongly to unpredictable, exciting energy while confusing anxiety or emotional ambiguity with love.',
    howItFeels: 'Electrifying, intense, all-consuming, magnetic highs and lows.',
    theHiddenFriction: 'Emotional instability, chronic uncertainty, uneven reciprocity, and lack of calm domestic safety.',
    mirrorPrompt: 'Notice whether the attraction is fueled by genuine safety and mutual investment, or by the thrill of trying to win someone over.',
    proactiveStrategy: 'Notice whether the attraction is fueled by genuine safety and mutual investment, or by the thrill of trying to win someone over.',
  },
  {
    id: 'trap_ignoring_timeline_mismatch',
    title: 'Ignoring Life-Stage & Family Timeline Divergence',
    category: 'pacing',
    summary: 'Overlooking fundamentally incompatible timelines (e.g. marriage, children, location relocation) because physical or intellectual spark is high.',
    description: 'Overlooking fundamentally incompatible timelines (e.g. marriage, children, location relocation) because physical or intellectual spark is high.',
    howItFeels: 'Optimistic belief that "things will work themselves out later" or that one of you will naturally change your mind.',
    theHiddenFriction: 'Resentment, painful delayed breakups 1–3 years in, or one partner feeling pressured into a life they did not want.',
    mirrorPrompt: 'Are you falling in love with who they are today, or with a version of them you hope will change their life direction later?',
    proactiveStrategy: 'Ask directly in the first 3 dates about 3–5 year life visions before deep emotional bonding occurs.',
  },
  {
    id: 'trap_avoidant_anxious_loop',
    title: 'Pursuing Emotional Distant Partners While Needing High Reassurance',
    category: 'communication',
    summary: 'High personal need for warm, steady communication, but repeatedly matched with partners who detach, go cold, or need days of radio silence.',
    description: 'High personal need for warm, steady communication, but repeatedly matched with partners who detach, go cold, or need days of radio silence.',
    howItFeels: 'Compulsive phone checking, self-doubt, analyzing every text tone, feeling "too needy" or emotionally unsatisfied.',
    theHiddenFriction: 'Chronic communication mismatch, unmet reassurance needs, and escalating protest behaviors during conflict.',
    mirrorPrompt: 'Your reassurance needs are valid. Does this person naturally provide consistent warmth, or do you have to beg for contact?',
    proactiveStrategy: 'Express your preferred texting and check-in cadence upfront without apologizing for having reassurance needs.',
  },
  {
    id: 'trap_over_adapting_too_picky_fear',
    title: 'Over-Compromising Boundaries from Fear of Being "Too Picky"',
    category: 'boundaries',
    summary: 'Suppressing core domestic, financial, or lifestyle boundaries because dating culture told you you are being "unrealistic".',
    description: 'Suppressing core domestic, financial, or lifestyle boundaries because dating culture told you you are being "unrealistic".',
    howItFeels: 'Minimizing genuine daily discomfort, walking on eggshells, pretending things do not bother you.',
    theHiddenFriction: 'Exhaustion, household resentment, slow erosion of personal autonomy, and eventual explosive conflict over small daily habits.',
    mirrorPrompt: 'A preference is flexible; a friction is manageable; but a genuine boundary is self-respect. Where are you over-adapting?',
    proactiveStrategy: 'Maintain your non-negotiables unapologetically. It is better to filter early than to build resentment later.',
  },
  {
    id: 'trap_cv_match_no_vulnerability',
    title: 'Ideal on Paper (The Resume Match) but Lacking Vulnerability',
    category: 'attraction',
    summary: 'Choosing someone who checks every external demographic, education, and career box, but with whom deep emotional resonance and playfulness feel flat.',
    description: 'Choosing someone who checks every external demographic, education, and career box, but with whom deep emotional resonance and playfulness feel flat.',
    howItFeels: 'Sensible, logical, approved by friends and family, but secretly lukewarm and uninspired.',
    theHiddenFriction: 'Polite companionship without emotional intimacy, emotional loneliness within the relationship, and lingering wanderlust.',
    mirrorPrompt: 'Does this person make you feel seen and playfully alive, or does this feel like a well-executed job interview?',
    proactiveStrategy: 'Look for shared laughter, physical ease, and emotional openness rather than an impressive resume.',
  },
  {
    id: 'trap_rescuing_project',
    title: 'The "Fixer" or Rescuer Archetype',
    category: 'rescuing',
    summary: 'Attracted to potential or vulnerability that feels like a project, mistaking empathy and caretaking for reciprocal romantic equality.',
    description: 'Attracted to potential or vulnerability that feels like a project, mistaking empathy and caretaking for reciprocal romantic equality.',
    howItFeels: 'Deeply purposeful, needed, validating, heroic, intense bonding over struggle.',
    theHiddenFriction: 'Parent-child dynamic, emotional exhaustion, imbalance of emotional labor, and feeling abandoned when they regain stability.',
    mirrorPrompt: 'Are they able to hold space for your needs, or is the relationship organized around accommodating their difficulties?',
    proactiveStrategy: 'Prioritize reciprocal support where both partners give and receive care in equal measure.',
  },
]

/**
 * Standard 3-Tier Boundary Triage attributes.
 * Helps users calibrate:
 * - Preference: Flexible, nice-to-have, happy to accommodate.
 * - Friction: Noticeable difference, but manageable with communication protocol.
 * - Dealbreaker: Non-negotiable boundary; living with this causes distress.
 */
export const DEFAULT_BOUNDARY_TRIAGE_ITEMS: BoundaryTriageItem[] = [
  {
    id: 'cleanliness',
    label: 'Domestic Order & Cleanliness',
    category: 'lifestyle',
    level: 'friction',
    description: 'How dishes, laundry, clutter, and surface cleanliness are maintained at home.',
    manageabilityTip: 'Manageable with explicit chore partitioning or scheduling, but painful if unspoken.',
  },
  {
    id: 'texting_cadence',
    label: 'Daily Texting & Reassurance Cadence',
    category: 'communication',
    level: 'preference',
    description: 'Frequency of daily check-ins (1–2 daily messages vs occasional silence between dates).',
    manageabilityTip: 'Very easily adapted once each partner articulates their attachment style openly.',
  },
  {
    id: 'family_timeline',
    label: 'Family & Children Vision',
    category: 'family',
    level: 'dealbreaker',
    description: 'Definitive stance on wanting, having, or never wanting biological/adopted children.',
    manageabilityTip: 'Non-negotiable. Trying to compromise here inevitably leads to irreversible regret.',
  },
  {
    id: 'substance_smoking',
    label: 'Tobacco & Nicotine Smoke-Free Home',
    category: 'lifestyle',
    level: 'dealbreaker',
    description: 'Living in an entirely smoke-free household environment.',
    manageabilityTip: 'Physical dealbreaker for non-smokers with respiratory sensitivity.',
  },
  {
    id: 'sensory_solitude',
    label: 'Solitary Recharge & Autonomy',
    category: 'autonomy',
    level: 'friction',
    description: 'Needing 1–2 solo evenings weekly without partner taking it personally.',
    manageabilityTip: 'Easily sustained when normalized as "parallel play" or healthy independence.',
  },
  {
    id: 'financial_pooling',
    label: 'Financial Transparency & Spending Style',
    category: 'finance',
    level: 'friction',
    description: 'Separate accounts with proportional split vs fully pooled joint expenses.',
    manageabilityTip: 'Requires clear transparent spreadsheets and agreed discretionary personal budgets.',
  },
  {
    id: 'diet_lifestyle',
    label: 'Dietary Compatibility (e.g. Vegetarian / Halal)',
    category: 'lifestyle',
    level: 'preference',
    description: 'Sharing meals together without requiring identical diets.',
    manageabilityTip: 'Completely workable in cosmopolitan dining and dual-option home cooking.',
  },
]

/**
 * Evaluates Mirror Check between user and candidate.
 * Identifies:
 * 1) Triggered Traps from user's acknowledged traps list
 * 2) Spark vs Practical Compatibility breakdown
 * 3) Specific manageable frictions and constructive coaching tips
 */
export function computeMirrorCheck(
  currentUser: UniversalUserProfile,
  candidate: UniversalUserProfile,
  evaluationScores: {
    mutualScore: number
    attractionScore: number
    lifestyleScore: number
    communicationScore: number
    familyScore: number
    relationshipScore: number
  }
): MirrorCheck {
  const acknowledged = currentUser.acknowledgedTraps || [
    'trap_adrenaline_over_safety',
    'trap_ignoring_timeline_mismatch',
  ]
  const triage = currentUser.boundaryTriage || {}

  const triggeredTraps: RelationshipTrap[] = []
  const frictions: FrictionNotice[] = []

  // Check 1: Timeline / Children Mismatch vs High Spark
  const userKids = currentUser.family.wantsChildren
  const candKids = candidate.family.wantsChildren
  const hasKidsMismatch =
    (userKids === 'definitely_yes' && (candKids === 'definitely_not' || candKids === 'leaning_no')) ||
    (userKids === 'definitely_not' && (candKids === 'definitely_yes' || candKids === 'leaning_yes'))

  if (hasKidsMismatch && acknowledged.includes('trap_ignoring_timeline_mismatch')) {
    const trap = DEFAULT_RELATIONSHIP_TRAPS.find((t) => t.id === 'trap_ignoring_timeline_mismatch')
    if (trap) triggeredTraps.push(trap)
    const tip = `You want ${userKids.replace('_', ' ')} while ${candidate.identity.name} indicated ${candKids.replace('_', ' ')}. Discuss this openly before emotional bonding deepens.`
    frictions.push({
      label: 'Family Timeline Divergence',
      category: 'family',
      severity: 'high',
      tip,
      protocol: tip,
    })
  }

  // Check 2: Reassurance Cadence vs Avoidant/Intermittent Texting
  const userCadence = currentUser.relationshipBlueprint?.reassuranceCadence || 'Warm daily check-ins'
  const candSchedule = candidate.availability.preferredMeetingFormat
  const candHours = candidate.availability.freeHoursPerWeek

  const isLowContactCand = candSchedule === 'direct_coffee' && candHours <= 10
  if (
    userCadence.includes('daily') &&
    isLowContactCand &&
    acknowledged.includes('trap_avoidant_anxious_loop')
  ) {
    const trap = DEFAULT_RELATIONSHIP_TRAPS.find((t) => t.id === 'trap_avoidant_anxious_loop')
    if (trap) triggeredTraps.push(trap)
    const tip = `${candidate.identity.name} has intense work schedules (${candHours}h free/wk) and low virtual contact. Notice if intermittent communication triggers your anxiety.`
    frictions.push({
      label: 'Communication & Availability Rhythm',
      category: 'communication',
      severity: 'moderate',
      tip,
      protocol: tip,
    })
  }

  // Check 3: Cleanliness Standard Friction (3-tier triage)
  const userClean = currentUser.lifestyle.cleanlinessStandard
  const candClean = candidate.lifestyle.cleanlinessStandard
  const cleanGap = Math.abs(userClean - candClean)

  if (cleanGap >= 2) {
    const cleanLevel = triage['cleanliness'] || 'friction'
    const tip = `Your cleanliness standard is ${userClean}/5 while ${candidate.identity.name}'s is ${candClean}/5. If you cohabitate, define chore ownership or quiet zones early.`
    frictions.push({
      label: 'Domestic Cleanliness Standards',
      category: 'lifestyle',
      severity: cleanLevel === 'dealbreaker' ? 'high' : 'moderate',
      tip,
      protocol: tip,
    })
  }

  // Check 4: High Spark vs Moderate Practical Compatibility
  const isHighSpark = evaluationScores.attractionScore >= 75 || evaluationScores.mutualScore >= 80
  const isModerateComp =
    evaluationScores.lifestyleScore < 70 ||
    evaluationScores.communicationScore < 70 ||
    frictions.length > 0

  if (
    isHighSpark &&
    isModerateComp &&
    acknowledged.includes('trap_adrenaline_over_safety') &&
    !triggeredTraps.some((t) => t.id === 'trap_adrenaline_over_safety')
  ) {
    const trap = DEFAULT_RELATIONSHIP_TRAPS.find((t) => t.id === 'trap_adrenaline_over_safety')
    if (trap) triggeredTraps.push(trap)
  }

  // Overall Spark & Compatibility Levels
  const sparkLevel: MirrorCheck['sparkLevel'] =
    evaluationScores.attractionScore >= 80 ? 'high' : evaluationScores.attractionScore >= 60 ? 'moderate' : 'calm'
  const compatibilityLevel: MirrorCheck['compatibilityLevel'] =
    frictions.some((f) => f.severity === 'high')
      ? 'friction'
      : evaluationScores.mutualScore >= 75
      ? 'high'
      : 'moderate'

  // Constructive Growth Opportunity Summary
  let growthOpportunity = 'Balanced reciprocal connection with clean, open communication pathways.'
  if (triggeredTraps.length > 0) {
    growthOpportunity = `Opportunity to practice conscious dating: Enjoy the connection while staying rooted in your stated ${triggeredTraps[0].category} boundaries.`
  } else if (frictions.length > 0) {
    growthOpportunity = `Minor lifestyle differences detected (${frictions[0].label}). Great candidate for candid, relaxed conversation on a low-pressure first date.`
  }

  const sparkSummary = isHighSpark
    ? 'Strong shared aesthetic, cultural interest, and lifestyle spark.'
    : 'Steady, grounded shared interests without intense initial adrenaline.'

  const compatibilitySummary =
    frictions.length === 0
      ? 'High reciprocal alignment across core values, life rhythm, and boundaries.'
      : `${frictions.length} manageable difference${frictions.length > 1 ? 's' : ''} to observe intentionally.`

  const gentleReflection =
    triggeredTraps.length > 0
      ? `High initial spark detected, but note: this connection touches your stated trap pattern (${triggeredTraps[0].title}). Take pacing slowly and clarify priorities early.`
      : frictions.length > 0
      ? `Authentic resonance with minor practical pacing differences (${frictions[0].label}). Grounded fit to explore with open conversation.`
      : 'Harmonious mutual resonance with clean boundary alignment and zero recognized trap patterns triggered.'

  const sparkVsCompatibilityRatio =
    Math.round((evaluationScores.attractionScore / Math.max(1, evaluationScores.mutualScore)) * 100) / 100

  return {
    hasTrapWarning: triggeredTraps.length > 0,
    triggeredTraps,
    sparkSummary,
    compatibilitySummary,
    sparkLevel,
    compatibilityLevel,
    frictions,
    growthOpportunity,
    gentleReflection,
    sparkVsCompatibilityRatio,
  }
}
