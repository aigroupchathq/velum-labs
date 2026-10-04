// Universal Compatibility Platform: Mock Profiles
// Governing Standards: Master Build Specification §5, §6, §12, §13, §31

import type { UniversalUserProfile } from '../types'

export const currentUser: UniversalUserProfile = {
  id: 'usr_elena_current',
  identity: {
    name: 'Elena Rostova',
    age: 30,
    gender: 'woman',
    genderPresentation: 'androgynous',
    pronouns: 'she/her',
    bio: 'System designer & speculative fiction reader. Passionate about urban ecology, ambient music synthesizers, and intentional slow living.',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    ],
    verified: true,
    culturalBackground: 'Eastern European / Mediterranean diaspora',
    languages: [
      { code: 'en', name: 'English', proficiency: 'fluent' },
      { code: 'ru', name: 'Russian', proficiency: 'native' },
      { code: 'es', name: 'Spanish', proficiency: 'conversational' },
    ],
  },
  intention: {
    primaryIntent: 'Long-Term Partnership / Marriage',
    relationshipStructure: 'monogamous',
    intentFlexibility: 20,
  },
  attractionPreferences: {
    physical: 3,
    emotional: 5,
    intellectual: 5,
    romantic: 4,
    sexual: 3,
    social: 3,
  },
  family: {
    hasChildren: 'none',
    wantsChildren: 'leaning_yes',
  },
  lifestyle: {
    diet: 'vegetarian', // "I am vegetarian" (Spec §5)
    smoking: 'never',
    alcohol: 'occasional',
    cannabis: 'never',
    cleanlinessStandard: 4,
    pets: ['cat'],
    petAllergies: [],
  },
  values: {
    coreValues: ['Integrity', 'Autonomy', 'Intellectual Curiosity', 'Compassion'],
    religion: 'Agnostic / Humanist',
    religiousObservance: 1,
    worldview: 'Scientific Rationalism & Existential Humanism',
    politicalCivic: 'Progressive / Democratic Green',
  },
  communication: {
    conflictStyle: 'reflective_deliberate',
    digitalCadence: 'regular_intervals',
    loveLanguages: ['Quality Time', 'Words of Affirmation'],
    neurotype: ['AuDHD', 'Sensory sensitive'],
  },
  accessibility: {
    stepFreeRequired: false,
    sensoryCalmRequired: true,
    aslRequired: false,
    sleepChronotype: 'night_owl',
  },
  geography: {
    cityName: 'Metropolis',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    maxDistanceKm: 25,
    distanceFlexibilityKm: 10,
    openToRelocation: false,
    openToLongDistance: false,
  },
  availability: {
    workSchedule: 'flexible',
    freeHoursPerWeek: 18,
    preferredMeetingFormat: 'thoughtful_messaging_first',
  },
  preferences: {
    gendersSought: ['all'],
    minAge: 27,
    maxAge: 36,
    ageFlexibilityYears: 2,
    // Spec §5: "I prefer vegetarian partners" + "I am willing to compromise (flexibility 70%)"
    dietPreference: {
      preferredDiets: ['vegetarian', 'vegan'],
      requirementLevel: 'PREFERENCE',
      flexibility: 70,
    },
    smokingPreference: {
      allowedSmoking: ['never'],
      requirementLevel: 'MUST',
      dealbreaker: true, // Non-smoker is a hard dealbreaker
    },
    wantsChildrenPreference: {
      acceptableAnswers: ['definitely_yes', 'leaning_yes', 'unsure'],
      requirementLevel: 'PREFERENCE',
      dealbreaker: false,
    },
    structurePreference: {
      acceptableStructures: ['monogamous', 'flexible'],
      requirementLevel: 'MUST',
      dealbreaker: true,
    },
    valuesWeight: 5,
    communicationWeight: 5,
  },
  privacy: {
    incognitoMode: false,
    fuzzLocationRadiusKm: 1.5,
  },
  behaviour: {
    responseRatePercent: 96,
    averageResponseHours: 3.2,
    ghostingReportsCount: 0,
    handshakesInitiated: 4,
  },
}

export const mockCandidates: UniversalUserProfile[] = [
  // 1. HIGH MUTUAL COMPATIBILITY (Maya Lin)
  {
    id: 'usr_maya_01',
    identity: {
      name: 'Maya Lin',
      age: 31,
      gender: 'woman',
      genderPresentation: 'feminine',
      pronouns: 'she/her',
      bio: 'Architectural acoustician & ceramicist. I spend weekends building soundscapes and fermentation jars. Looking for a conscious co-builder for long-term domestic life.',
      photos: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      ],
      verified: true,
      culturalBackground: 'East Asian / Pacific Northwest',
      languages: [
        { code: 'en', name: 'English', proficiency: 'native' },
        { code: 'zh', name: 'Mandarin', proficiency: 'conversational' },
      ],
    },
    intention: {
      primaryIntent: 'Long-Term Partnership / Marriage',
      relationshipStructure: 'monogamous',
      intentFlexibility: 15,
    },
    attractionPreferences: {
      physical: 3,
      emotional: 5,
      intellectual: 5,
      romantic: 5,
      sexual: 3,
      social: 3,
    },
    family: {
      hasChildren: 'none',
      wantsChildren: 'leaning_yes',
    },
    lifestyle: {
      diet: 'vegetarian',
      smoking: 'never',
      alcohol: 'occasional',
      cannabis: 'never',
      cleanlinessStandard: 4,
      pets: ['cat'],
      petAllergies: [],
    },
    values: {
      coreValues: ['Integrity', 'Autonomy', 'Intellectual Curiosity', 'Compassion'],
      religion: 'Secular Buddhist / Naturalist',
      religiousObservance: 1,
      worldview: 'Scientific Rationalism',
      politicalCivic: 'Progressive / Democratic Green',
    },
    communication: {
      conflictStyle: 'reflective_deliberate',
      digitalCadence: 'regular_intervals',
      loveLanguages: ['Quality Time', 'Acts of Service'],
      neurotype: ['Sensory sensitive'],
    },
    accessibility: {
      stepFreeRequired: false,
      sensoryCalmRequired: true,
      aslRequired: false,
      sleepChronotype: 'night_owl',
    },
    geography: {
      cityName: 'Metropolis (East District)',
      coordinates: { lat: 37.7833, lng: -122.4167 }, // ~6.2 km away
      maxDistanceKm: 30,
      distanceFlexibilityKm: 15,
      openToRelocation: false,
      openToLongDistance: false,
    },
    availability: {
      workSchedule: 'flexible',
      freeHoursPerWeek: 20,
      preferredMeetingFormat: 'thoughtful_messaging_first',
    },
    preferences: {
      gendersSought: ['woman', 'nonbinary', 'all'],
      minAge: 28,
      maxAge: 35,
      ageFlexibilityYears: 3,
      dietPreference: {
        preferredDiets: ['vegetarian', 'vegan'],
        requirementLevel: 'PREFERENCE',
        flexibility: 80,
      },
      smokingPreference: {
        allowedSmoking: ['never'],
        requirementLevel: 'MUST',
        dealbreaker: true,
      },
      wantsChildrenPreference: {
        acceptableAnswers: ['definitely_yes', 'leaning_yes', 'unsure'],
        requirementLevel: 'PREFERENCE',
        dealbreaker: false,
      },
      structurePreference: {
        acceptableStructures: ['monogamous'],
        requirementLevel: 'MUST',
        dealbreaker: true,
      },
      valuesWeight: 5,
      communicationWeight: 5,
    },
    privacy: {
      incognitoMode: false,
      fuzzLocationRadiusKm: 1.5,
    },
    behaviour: {
      responseRatePercent: 98,
      averageResponseHours: 2.1,
      ghostingReportsCount: 0,
      handshakesInitiated: 6,
    },
  },

  // 2. HARD DEALBREAKER CONFLICT (Liam Vance - Smokes Socially)
  {
    id: 'usr_liam_02',
    identity: {
      name: 'Liam Vance',
      age: 32,
      gender: 'man',
      pronouns: 'he/him',
      bio: 'Documentary cinematographer. Always on location or working in editing bays. Coffee enthusiast, occasional vinyl DJ.',
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      ],
      verified: true,
      languages: [{ code: 'en', name: 'English', proficiency: 'native' }],
    },
    intention: {
      primaryIntent: 'Short-Term Dating / Exploratory',
      relationshipStructure: 'monogamous',
      intentFlexibility: 50,
    },
    attractionPreferences: {
      physical: 4,
      emotional: 3,
      intellectual: 4,
      romantic: 2,
      sexual: 4,
      social: 4,
    },
    family: {
      hasChildren: 'none',
      wantsChildren: 'definitely_not',
    },
    lifestyle: {
      diet: 'omnivore',
      smoking: 'socially', // VIOLATES Elena's MUST Non-Smoker Dealbreaker!
      alcohol: 'frequent',
      cannabis: 'socially',
      cleanlinessStandard: 2,
      pets: ['dog'],
      petAllergies: [],
    },
    values: {
      coreValues: ['Creativity', 'Adventure', 'Humor'],
      religion: 'Atheist',
      worldview: 'Pragmatist',
    },
    communication: {
      conflictStyle: 'direct_immediate',
      digitalCadence: 'frequent',
      loveLanguages: ['Physical Touch'],
    },
    accessibility: {
      stepFreeRequired: false,
      sensoryCalmRequired: false,
      aslRequired: false,
      sleepChronotype: 'night_owl',
    },
    geography: {
      cityName: 'Metropolis',
      coordinates: { lat: 37.7600, lng: -122.4400 },
      maxDistanceKm: 20,
      distanceFlexibilityKm: 5,
      openToRelocation: true,
      openToLongDistance: true,
    },
    availability: {
      workSchedule: 'flexible',
      freeHoursPerWeek: 12,
      preferredMeetingFormat: 'direct_coffee',
    },
    preferences: {
      gendersSought: ['all'],
      minAge: 24,
      maxAge: 34,
      ageFlexibilityYears: 1,
      dietPreference: {
        preferredDiets: ['omnivore', 'vegetarian'],
        requirementLevel: 'NEUTRAL',
        flexibility: 100,
      },
      smokingPreference: {
        allowedSmoking: ['never', 'socially'],
        requirementLevel: 'NEUTRAL',
        dealbreaker: false,
      },
      wantsChildrenPreference: {
        acceptableAnswers: ['definitely_not'],
        requirementLevel: 'PREFERENCE',
        dealbreaker: false,
      },
      structurePreference: {
        acceptableStructures: ['monogamous', 'flexible'],
        requirementLevel: 'PREFERENCE',
        dealbreaker: false,
      },
      valuesWeight: 2,
      communicationWeight: 3,
    },
    privacy: {
      incognitoMode: false,
      fuzzLocationRadiusKm: 1.5,
    },
    behaviour: {
      responseRatePercent: 82,
      averageResponseHours: 8.4,
      ghostingReportsCount: 1,
      handshakesInitiated: 12,
    },
  },

  // 3. CONTROLLED FLEXIBILITY DEMONSTRATION (Sora Tanaka - Omnivore, but Elena is flexible)
  {
    id: 'usr_sora_03',
    identity: {
      name: 'Sora Tanaka',
      age: 29,
      gender: 'nonbinary',
      genderPresentation: 'androgynous',
      pronouns: 'they/them',
      bio: 'Computational biology researcher studying fungal mycelium networks. Passionate about climbing, climate policy, and cooking elaborate family meals.',
      photos: [
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      ],
      verified: true,
      culturalBackground: 'Japanese / North American',
      languages: [
        { code: 'en', name: 'English', proficiency: 'native' },
        { code: 'ja', name: 'Japanese', proficiency: 'fluent' },
      ],
    },
    intention: {
      primaryIntent: 'Long-Term Partnership / Marriage',
      relationshipStructure: 'monogamous',
      intentFlexibility: 20,
    },
    attractionPreferences: {
      physical: 3,
      emotional: 5,
      intellectual: 5,
      romantic: 4,
      sexual: 3,
      social: 4,
    },
    family: {
      hasChildren: 'none',
      wantsChildren: 'leaning_yes',
    },
    lifestyle: {
      diet: 'omnivore', // Elena prefers veg, but with 70% flexibility -> partial credit, NOT excluded!
      smoking: 'never',
      alcohol: 'sober',
      cannabis: 'never',
      cleanlinessStandard: 4,
      pets: [],
      petAllergies: [],
    },
    values: {
      coreValues: ['Integrity', 'Compassion', 'Environmental Stewardship', 'Intellectual Curiosity'],
      religion: 'Agnostic',
      worldview: 'Scientific Rationalism',
      politicalCivic: 'Progressive / Democratic Socialist',
    },
    communication: {
      conflictStyle: 'reflective_deliberate',
      digitalCadence: 'regular_intervals',
      loveLanguages: ['Quality Time', 'Acts of Service'],
      neurotype: ['Autistic', 'Direct communicator'],
    },
    accessibility: {
      stepFreeRequired: false,
      sensoryCalmRequired: true,
      aslRequired: false,
      sleepChronotype: 'intermediate',
    },
    geography: {
      cityName: 'Metropolis (Bayside)',
      coordinates: { lat: 37.7900, lng: -122.4000 }, // ~8.1 km away
      maxDistanceKm: 25,
      distanceFlexibilityKm: 10,
      openToRelocation: false,
      openToLongDistance: false,
    },
    availability: {
      workSchedule: 'flexible',
      freeHoursPerWeek: 16,
      preferredMeetingFormat: 'thoughtful_messaging_first',
    },
    preferences: {
      gendersSought: ['all'],
      minAge: 27,
      maxAge: 34,
      ageFlexibilityYears: 2,
      dietPreference: {
        preferredDiets: ['omnivore', 'vegetarian', 'vegan'],
        requirementLevel: 'NEUTRAL',
        flexibility: 100,
      },
      smokingPreference: {
        allowedSmoking: ['never'],
        requirementLevel: 'MUST',
        dealbreaker: true,
      },
      wantsChildrenPreference: {
        acceptableAnswers: ['definitely_yes', 'leaning_yes'],
        requirementLevel: 'PREFERENCE',
        dealbreaker: false,
      },
      structurePreference: {
        acceptableStructures: ['monogamous'],
        requirementLevel: 'MUST',
        dealbreaker: true,
      },
      valuesWeight: 5,
      communicationWeight: 5,
    },
    privacy: {
      incognitoMode: false,
      fuzzLocationRadiusKm: 1.5,
    },
    behaviour: {
      responseRatePercent: 95,
      averageResponseHours: 2.8,
      ghostingReportsCount: 0,
      handshakesInitiated: 3,
    },
  },

  // 4. RELATIONSHIP STRUCTURE DEALBREAKER (Devon Cruz - Polyamorous)
  {
    id: 'usr_devon_04',
    identity: {
      name: 'Devon Cruz',
      age: 33,
      gender: 'man',
      pronouns: 'he/they',
      bio: 'Community organizer, cooperative housing steward, and experimental synthesist. Believes in expansive chosen family and transparent emotional accountability.',
      photos: [
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      ],
      verified: true,
      languages: [{ code: 'en', name: 'English', proficiency: 'fluent' }],
    },
    intention: {
      primaryIntent: 'Long-Term Partnership / Marriage',
      relationshipStructure: 'polyamorous', // CONFLICTS with Elena's Monogamous Dealbreaker!
      intentFlexibility: 0,
    },
    attractionPreferences: {
      physical: 3,
      emotional: 5,
      intellectual: 5,
      romantic: 4,
      sexual: 3,
      social: 5,
    },
    family: {
      hasChildren: 'none',
      wantsChildren: 'unsure',
    },
    lifestyle: {
      diet: 'vegan',
      smoking: 'never',
      alcohol: 'occasional',
      cannabis: 'never',
      cleanlinessStandard: 3,
      pets: ['dog'],
      petAllergies: [],
    },
    values: {
      coreValues: ['Community', 'Autonomy', 'Justice', 'Compassion'],
      religion: 'Spiritual Naturalism',
      worldview: 'Interdependent Humanism',
    },
    communication: {
      conflictStyle: 'reflective_deliberate',
      digitalCadence: 'regular_intervals',
      loveLanguages: ['Words of Affirmation', 'Quality Time'],
    },
    accessibility: {
      stepFreeRequired: false,
      sensoryCalmRequired: false,
      aslRequired: false,
      sleepChronotype: 'intermediate',
    },
    geography: {
      cityName: 'Metropolis',
      coordinates: { lat: 37.7650, lng: -122.4200 },
      maxDistanceKm: 30,
      distanceFlexibilityKm: 10,
      openToRelocation: false,
      openToLongDistance: false,
    },
    availability: {
      workSchedule: 'flexible',
      freeHoursPerWeek: 15,
      preferredMeetingFormat: 'thoughtful_messaging_first',
    },
    preferences: {
      gendersSought: ['all'],
      minAge: 26,
      maxAge: 38,
      ageFlexibilityYears: 2,
      dietPreference: {
        preferredDiets: ['vegan', 'vegetarian'],
        requirementLevel: 'PREFERENCE',
        flexibility: 60,
      },
      smokingPreference: {
        allowedSmoking: ['never'],
        requirementLevel: 'MUST',
        dealbreaker: true,
      },
      wantsChildrenPreference: {
        acceptableAnswers: ['definitely_yes', 'leaning_yes', 'unsure'],
        requirementLevel: 'NEUTRAL',
        dealbreaker: false,
      },
      structurePreference: {
        acceptableStructures: ['polyamorous', 'enm'],
        requirementLevel: 'MUST',
        dealbreaker: true,
      },
      valuesWeight: 5,
      communicationWeight: 4,
    },
    privacy: {
      incognitoMode: false,
      fuzzLocationRadiusKm: 1.5,
    },
    behaviour: {
      responseRatePercent: 91,
      averageResponseHours: 4.1,
      ghostingReportsCount: 0,
      handshakesInitiated: 5,
    },
  },

  // 5. UNCERTAINTY & UNKNOWN TESTING (Nadia Al-Mansoor - Partial profile)
  {
    id: 'usr_nadia_05',
    identity: {
      name: 'Nadia Al-Mansoor',
      age: 28,
      gender: 'woman',
      pronouns: 'she/her',
      bio: 'Comparative literature doctoral student. Currently writing about translation ethics and poetry of exile. Quiet cafe reader.',
      photos: [
        'https://images.unsplash.com/photo-1534751516642-a1714f5a3068?auto=format&fit=crop&w=800&q=80',
      ],
      verified: false, // Unverified -> Tests verification discount on confidence
      languages: [
        { code: 'en', name: 'English', proficiency: 'fluent' },
        { code: 'ar', name: 'Arabic', proficiency: 'native' },
        { code: 'fr', name: 'French', proficiency: 'fluent' },
      ],
    },
    intention: {
      primaryIntent: 'Long-Term Partnership / Marriage',
      relationshipStructure: 'monogamous',
      intentFlexibility: 20,
    },
    attractionPreferences: {
      physical: 2,
      emotional: 5,
      intellectual: 5,
      romantic: 4,
      sexual: 2,
      social: 2,
    },
    family: {
      hasChildren: 'none',
      wantsChildren: 'unsure',
    },
    lifestyle: {
      diet: 'vegetarian',
      smoking: 'never',
      alcohol: 'sober',
      cannabis: 'never',
      cleanlinessStandard: 4,
      pets: [],
      petAllergies: [],
    },
    values: {
      coreValues: ['Intellectual Curiosity', 'Integrity'],
      religion: 'Cultural Islam / Philosophical Agnosticism',
    },
    communication: {
      conflictStyle: 'reflective_deliberate',
      digitalCadence: 'regular_intervals',
      loveLanguages: ['Words of Affirmation'],
    },
    accessibility: {
      stepFreeRequired: false,
      sensoryCalmRequired: true,
      aslRequired: false,
      sleepChronotype: 'night_owl',
    },
    geography: {
      cityName: 'Metropolis (University Heights)',
      coordinates: { lat: 37.7700, lng: -122.4300 }, // ~3.5 km away
      maxDistanceKm: 20,
      distanceFlexibilityKm: 10,
      openToRelocation: false,
      openToLongDistance: false,
    },
    availability: {
      workSchedule: 'flexible',
      freeHoursPerWeek: 14,
      preferredMeetingFormat: 'thoughtful_messaging_first',
    },
    preferences: {
      gendersSought: ['all'],
      minAge: 26,
      maxAge: 35,
      ageFlexibilityYears: 2,
      dietPreference: {
        preferredDiets: ['vegetarian'],
        requirementLevel: 'NEUTRAL',
        flexibility: 100,
      },
      smokingPreference: {
        allowedSmoking: ['never'],
        requirementLevel: 'MUST',
        dealbreaker: true,
      },
      wantsChildrenPreference: {
        acceptableAnswers: ['leaning_yes', 'unsure'],
        requirementLevel: 'NEUTRAL',
        dealbreaker: false,
      },
      structurePreference: {
        acceptableStructures: ['monogamous'],
        requirementLevel: 'MUST',
        dealbreaker: true,
      },
      valuesWeight: 4,
      communicationWeight: 4,
    },
    privacy: {
      incognitoMode: false,
      fuzzLocationRadiusKm: 1.5,
    },
    behaviour: {
      responseRatePercent: 88,
      averageResponseHours: 4.9,
      ghostingReportsCount: 0,
      handshakesInitiated: 2,
    },
  },
]
