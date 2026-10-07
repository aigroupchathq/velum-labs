// ============================================================================
// tools/syntheticPopulation.ts
// Deterministic, Seeded Synthetic Population Generator
// Conforms to: TEST_PLAN.md §5, EVALUATION.md §2, and Master Build Prompt §25
// ============================================================================

import type { UniversalUserProfile } from '../src/types/index.js'

// Simple PRNG (Linear Congruential Generator / Mulberry32) for deterministic reproducibility
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface GeneratorOptions {
  count: number
  seed?: number
}

export function generateSyntheticPopulation(options: GeneratorOptions): UniversalUserProfile[] {
  const { count, seed = 42 } = options
  const random = mulberry32(seed)

  const names = [
    'Alex', 'Jordan', 'Taylor', 'Morgan', 'Sam', 'Chris', 'Pat', 'Riley', 'Casey',
    'Jamie', 'Avery', 'Dakota', 'Reese', 'Rowan', 'Quinn', 'Harper', 'Skyler', 'Logan'
  ]
  const diets = ['omnivore', 'vegetarian', 'vegan', 'pescatarian']
  const smokingOptions = ['never', 'socially', 'regularly']
  const intentions = [
    'Long-Term Partnership / Marriage',
    'Committed Relationship',
    'Exploration / Casual',
    'Friendship / Community'
  ]
  const structures = ['monogamous', 'polyamorous', 'enm', 'flexible']
  const valuesPool = [
    'Integrity', 'Autonomy', 'Intellectual Curiosity', 'Compassion',
    'Social Justice', 'Ambition', 'Spontaneity', 'Tradition', 'Creativity'
  ]
  const commStyles: Array<'direct_immediate' | 'reflective_deliberate' | 'space_first' | 'diplomatic'> = [
    'reflective_deliberate',
    'direct_immediate',
    'space_first',
    'diplomatic',
  ]
  const chronotypes = ['morning_lark', 'intermediate', 'night_owl']

  const population: UniversalUserProfile[] = []

  for (let i = 0; i < count; i++) {
    const id = `syn_${seed}_${(i + 1).toString().padStart(5, '0')}`
    const name = `${names[Math.floor(random() * names.length)]} ${String.fromCharCode(65 + (i % 26))}.`
    const age = 22 + Math.floor(random() * 26) // 22 to 47
    const diet = diets[Math.floor(random() * diets.length)]
    const smoking = smokingOptions[Math.floor(random() * smokingOptions.length)]
    const intention = intentions[Math.floor(random() * intentions.length)]
    const structure = structures[Math.floor(random() * structures.length)]
    const commStyle = commStyles[Math.floor(random() * commStyles.length)]
    const chronotype = chronotypes[Math.floor(random() * chronotypes.length)]
    const verified = random() > 0.2 // 80% verified

    // Select 3 to 5 core values
    const numValues = 3 + Math.floor(random() * 3)
    const shuffledValues = [...valuesPool].sort(() => random() - 0.5)
    const selectedValues = shuffledValues.slice(0, numValues)

    // Stance on kids
    const kidsStances = ['definitely_yes', 'open_to_children', 'unsure', 'definitely_not']
    const kids = kidsStances[Math.floor(random() * kidsStances.length)]

    // Dealbreaker on smoking? (50% chance if non-smoker)
    const smokingDealbreaker = smoking === 'never' && random() > 0.5

    // Dealbreaker on structure? (70% chance if monogamous)
    const structureDealbreaker = structure === 'monogamous' && random() > 0.3

    // Dietary flexibility (0 to 100%)
    const dietFlexibility = Math.floor(random() * 101)

    // Location coordinates centered roughly around SF Bay Area with random scatter
    const lat = 37.7749 + (random() - 0.5) * 0.4
    const lon = -122.4194 + (random() - 0.5) * 0.4

    population.push({
      id,
      completionStage: 6,
      identity: {
        name,
        age,
        gender: random() > 0.5 ? 'woman' : 'man',
        genderPresentation: 'androgynous',
        pronouns: random() > 0.5 ? 'she/her' : 'he/him',
        bio: `Synthetic test profile #${i + 1} generated for reproducible simulation benchmarks.`,
        photos: ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'],
        verified,
        culturalBackground: 'Cosmopolitan',
        languages: [{ code: 'en', name: 'English', proficiency: 'fluent' }],
      },
      intention: {
        primaryIntent: intention,
        relationshipStructure: structure,
        intentFlexibility: Math.floor(random() * 50),
      },
      attractionPreferences: {
        physical: 1 + Math.floor(random() * 5),
        emotional: 1 + Math.floor(random() * 5),
        intellectual: 1 + Math.floor(random() * 5),
        romantic: 1 + Math.floor(random() * 5),
        sexual: 1 + Math.floor(random() * 5),
        social: 1 + Math.floor(random() * 5),
      },
      family: {
        currentChildren: 'none',
        wantsChildren: kids,
        coParentingPhilosophy: 'collaborative egalitarian',
      },
      lifestyle: {
        diet,
        smoking,
        alcohol: 'moderate',
        cannabis: 'never',
        cleanlinessStandard: 3,
        pets: ['cat'],
        petAllergies: [],
      },
      values: {
        coreValues: selectedValues,
        politicalOrientation: 'moderate',
        religiousTradition: 'secular',
        communityInvolvement: 'moderate',
      },
      communication: {
        conflictStyle: commStyle,
        digitalCadence: 'regular_intervals',
        loveLanguages: ['quality_time', 'words_of_affirmation'],
      },
      accessibility: {
        stepFreeRequired: false,
        sensoryCalmRequired: false,
        aslRequired: false,
        sleepChronotype: chronotype as 'morning_lark' | 'intermediate' | 'night_owl',
      },
      geography: {
        cityName: 'San Francisco, CA',
        coordinates: { lat, lng: lon },
        maxDistanceKm: 60,
        distanceFlexibilityKm: 25,
        openToLongDistance: random() > 0.5,
        openToRelocation: false,
      },
      availability: {
        workSchedule: 'flexible',
        freeHoursPerWeek: 15,
        preferredMeetingFormat: 'thoughtful_messaging_first',
      },
      preferences: {
        gendersSought: ['all'],
        minAge: Math.max(18, age - 10),
        maxAge: age + 10,
        ageFlexibilityYears: 3,
        dietPreference: {
          preferredDiets: diet === 'omnivore' ? ['omnivore', 'vegetarian', 'vegan'] : [diet],
          requirementLevel: dietFlexibility < 20 ? 'MUST' : 'PREFERENCE',
          flexibility: dietFlexibility,
        },
        smokingPreference: {
          allowedSmoking: smokingDealbreaker ? ['never'] : ['never', 'socially'],
          requirementLevel: smokingDealbreaker ? 'MUST' : 'PREFERENCE',
          dealbreaker: smokingDealbreaker,
        },
        wantsChildrenPreference: {
          acceptableAnswers: [kids],
          requirementLevel: 'PREFERENCE',
          dealbreaker: false,
        },
        structurePreference: {
          acceptableStructures: structureDealbreaker ? [structure] : [structure, 'flexible'],
          requirementLevel: structureDealbreaker ? 'MUST' : 'PREFERENCE',
          dealbreaker: structureDealbreaker,
        },
        valuesWeight: 4,
        communicationWeight: 4,
      },
      privacy: {
        incognitoMode: false,
        fuzzLocationRadiusKm: 1.5,
      },
      behaviour: {
        responseRatePercent: 90,
        averageResponseHours: 4.0,
        ghostingReportsCount: 0,
        handshakesInitiated: 2,
      },
    })
  }

  return population
}
