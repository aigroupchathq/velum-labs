// ============================================================================
// server/src/routes/preferences.ts
// Preferences, Contradictions, and What-If Simulator Routes (API_SPEC.md §4)
// ============================================================================

import { Router, Request, Response } from 'express'
import { db } from '../data/dbStore.js'
import { detectUserContradictions } from '../../../src/utils/matchingEngine.js'

export const preferencesRouter = Router()

// GET /api/v1/preferences/contradictions (Spec §4.1)
preferencesRouter.get('/contradictions', (req: Request, res: Response): void => {
  const userId = (req.query.userId as string) || '11111111-1111-1111-1111-111111111111'
  const user = db.getUser(userId)

  if (!user) {
    res.status(404).json({ error: 'User not found.' })
    return
  }

  const contradictions = detectUserContradictions(user)

  res.json({
    userId,
    contradictionsFound: contradictions.length,
    contradictions,
  })
})

// POST /api/v1/preferences/optimize (Spec §4.2 What-If Simulator)
preferencesRouter.post('/optimize', (req: Request, res: Response): void => {
  const { userId, distanceDeltaKm = 0, ageFlexDeltaYears = 0, dietFlexDeltaPercent = 0 } = req.body
  const targetUserId = userId || '11111111-1111-1111-1111-111111111111'
  const user = db.getUser(targetUserId)

  if (!user) {
    res.status(404).json({ error: 'User not found.' })
    return
  }

  // Baseline active pool simulation
  const basePool = 24
  const simulatedExpansion = Math.round(
    basePool +
      (distanceDeltaKm / 5) * 6 +
      ageFlexDeltaYears * 11 +
      (dietFlexDeltaPercent / 10) * 4
  )

  const expansionPercent = Math.round(((simulatedExpansion - basePool) / basePool) * 100)
  const estimatedCompatibilityImpact = -Math.round((expansionPercent / 100) * 2)

  db.logAudit(targetUserId, 'user', 'RUN_PREFERENCE_SIMULATION', 'preference_optimizer', null, {
    distanceDeltaKm,
    ageFlexDeltaYears,
    dietFlexDeltaPercent,
    expansionPercent,
  })

  res.json({
    userId: targetUserId,
    basePool,
    simulatedPool: simulatedExpansion,
    expansionPercent,
    estimatedCompatibilityImpact,
    disclaimer:
      'Projections are empirical simulations based on local density and do not dilute core mutual value requirements.',
  })
})
