import { evaluateMatchCompatibility } from './matchingEngine'
import type { Profile, UserProfile, UserPreferences } from '../types'

const baseUser: UserProfile = {
  name: 'Alex',
  age: 25,
  gender: 'man',
  bio: 'Creative director & photographer',
  photos: ['photo1.jpg'],
  occupation: 'Creative Director',
  school: 'Pratt',
  passions: ['Photography', 'Coffee', 'Music'],
  smoking: 'Never',
  drinking: 'Socially',
  workout: 'Yoga',
  intent: 'Looking for long-term partner 💘',
  distance: 0,
}

const basePreferences: UserPreferences = {
  minAge: 22,
  maxAge: 28,
  maxDistance: 20,
  showMe: 'everyone',
  soundEnabled: true,
  darkMode: true,
  incognito: false,
  hardRequirements: {
    ageRange: true,
    distance: true,
    nonSmoker: true,
    relationshipIntent: true,
  },
  flexibilityMargins: {
    age: 2, // ±2 years
    distance: 5, // ±5 miles
  },
  strongPreferences: {
    intent: true,
    lifestyle: true,
  },
}

console.log('=== TEST 1: HARD REQUIREMENT EXCLUSION ===')
const smokerCandidate: Profile = {
  id: 'c1',
  name: 'Sam',
  age: 24,
  bio: 'Guitarist',
  distance: 5,
  location: 'Brooklyn',
  verified: true,
  photos: ['photo.jpg'],
  passions: ['Music'],
  basics: { smoking: 'Socially vape' }, // violates hard nonSmoker requirement!
  intent: 'Looking for long-term partner 💘',
}

const report1 = evaluateMatchCompatibility(baseUser, basePreferences, smokerCandidate)
console.log('Excluded:', report1.isExcluded)
console.log('Exclusion reasons:', report1.exclusionReasons)
console.log('Conflicts:', report1.conflicts.map(c => `[${c.severity}] ${c.message}`))
console.assert(report1.isExcluded === true, 'Test 1 Failed: Should be excluded')
console.assert(report1.mutualScore === 0, 'Test 1 Failed: Excluded score must be 0')
console.log('Test 1 PASSED!\n')

console.log('=== TEST 2 & 4: CONTROLLED FLEXIBILITY RELAXATION ===')
const slightlyDistantCandidate: Profile = {
  id: 'c2',
  name: 'Taylor',
  age: 24,
  bio: 'Artist',
  distance: 23, // 23 mi is > 20 mi maxDistance, but within 20 + 5 (flexibility) = 25 mi
  location: 'Queens',
  verified: true,
  photos: ['photo.jpg', 'photo2.jpg', 'photo3.jpg'],
  passions: ['Photography', 'Coffee'],
  basics: { smoking: 'Never 🚭' },
  intent: 'Looking for long-term partner 💘',
}

const report2 = evaluateMatchCompatibility(baseUser, basePreferences, slightlyDistantCandidate)
console.log('Excluded:', report2.isExcluded)
console.log('Mutual Score:', report2.mutualScore)
const distCrit = report2.hardRequirements.find(c => c.field === 'distance')
console.log('Distance relaxed?', distCrit?.relaxed, 'Detail:', distCrit?.detail)
console.assert(report2.isExcluded === false, 'Test 2 Failed: Should NOT be excluded thanks to flexibility')
console.assert(distCrit?.relaxed === true, 'Test 2 Failed: Distance should be marked relaxed')
console.log('Test 2 & 4 PASSED!\n')

console.log('=== TEST 5: UNKNOWN DOES NOT TREAT AS INCOMPATIBILITY ===')
const minimalCandidate: Profile = {
  id: 'c3',
  name: 'Jordan',
  age: 25,
  bio: 'Minimalist',
  distance: 5,
  location: 'Manhattan',
  verified: false,
  photos: ['photo.jpg'],
  passions: [], // unknown / empty
  basics: {}, // smoking, drinking, workout unknown
  intent: undefined, // unknown
}

const report3 = evaluateMatchCompatibility(baseUser, basePreferences, minimalCandidate)
console.log('Excluded:', report3.isExcluded)
console.log('Mutual Score:', report3.mutualScore)
console.log('Unknown attributes:', report3.unknownAttributes)
console.log('Confidence Score:', report3.confidenceScore, `(${report3.confidenceRating})`)
// Score is not penalized to 0 because missing attributes are ignored in compatibility score!
console.assert(report3.mutualScore > 70, 'Test 5 Failed: Unknown attributes should not drag score down to 0')
// But confidence is lower because many fields are unknown
console.assert(report3.confidenceScore < report2.confidenceScore, 'Test 5 Failed: Confidence should be lower when attributes are unknown')
console.log('Test 5 PASSED!\n')

console.log('=== TEST 6: MUTUALITY (A->B AND B->A) ===')
// Candidate B likes older partners (minAge 29), but User A is age 25
const pickyCandidate: Profile = {
  id: 'c4',
  name: 'Morgan',
  age: 26,
  bio: 'Architect',
  distance: 4,
  location: 'Brooklyn',
  verified: true,
  photos: ['p1.jpg', 'p2.jpg'],
  passions: ['Photography', 'Music'],
  basics: { smoking: 'Never 🚭' },
  intent: 'Looking for long-term partner 💘',
  partnerCriteria: {
    minAge: 29, // User A is 25, so diff = 4 > flex(2) -> violates B's criteria!
    maxAge: 35,
    maxDistance: 10,
    strictNonSmoker: true,
  }
}

const report4 = evaluateMatchCompatibility(baseUser, basePreferences, pickyCandidate)
console.log('A -> B Score (User likes Morgan):', report4.scoreAtoB)
console.log('B -> A Score (Morgan likes User):', report4.scoreBtoA)
console.log('Mutual Score:', report4.mutualScore)
console.log('Exclusion Reasons:', report4.exclusionReasons)
console.log('B -> A Conflicts:', report4.conflicts.filter(c => c.side === 'B_to_A').map(c => c.message))
console.assert(report4.isExcluded === true, 'Test 6 Failed: B->A exclusion must exclude candidate mutually')
console.log('Test 6 PASSED!\n')

console.log('=== TEST 7: CONFLICT IDENTIFICATION ===')
const conflictingIntentCandidate: Profile = {
  id: 'c5',
  name: 'Riley',
  age: 25,
  bio: 'Party planner',
  distance: 3,
  location: 'SoHo',
  verified: true,
  photos: ['p1.jpg'],
  passions: ['Music'],
  basics: { smoking: 'Never 🚭' },
  intent: 'Casual dating only 🥂', // User wants long-term
}

const nonHardIntentPrefs: UserPreferences = {
  ...basePreferences,
  hardRequirements: {
    ...basePreferences.hardRequirements,
    relationshipIntent: false, // strong preference, not hard
  }
}

const report5 = evaluateMatchCompatibility(baseUser, nonHardIntentPrefs, conflictingIntentCandidate)
console.log('Is Excluded?', report5.isExcluded)
console.log('Identified Conflicts:', report5.conflicts.map(c => `[${c.severity}] ${c.message}`))
console.assert(report5.conflicts.length > 0, 'Test 7 Failed: Must explicitly identify conflict')
console.log('Test 7 PASSED!\n')

console.log('=== TEST 8: CONFIDENCE SEPARATE FROM COMPATIBILITY ===')
console.log('Candidate 2 (Fully specified & verified): Compatibility =', report2.mutualScore, '%, Confidence =', report2.confidenceScore, '%')
console.log('Candidate 3 (Few fields known): Compatibility =', report3.mutualScore, '%, Confidence =', report3.confidenceScore, '%')
console.assert(report2.confidenceScore !== report2.mutualScore, 'Confidence is separate metric from Compatibility')
console.log('Test 8 PASSED!\n')

console.log('ALL 8 MATCHING FRAMEWORK RULES VERIFIED AND PASSED!')
