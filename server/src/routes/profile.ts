// ============================================================================
// server/src/routes/profile.ts
// Progressive Disclosure Profile Endpoints (API_SPEC.md §2)
// Protected with requireAuth & session-derived identity
// ============================================================================

import { Router, Response } from 'express'
import { db } from '../data/dbStore.js'
import { UniversalUserProfile } from '../../../src/types/index.js'
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js'

export const profileRouter = Router()

// GET /api/v1/profile/me (Spec §2.1)
profileRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.actorUserId!
  const user = db.getUser(userId)

  if (!user) {
    res.status(404).json({ error: 'Profile not found.' })
    return
  }

  res.json({ profile: user })
})

// PUT /api/v1/profile/stage/:stageNumber (Spec §2.2)
profileRouter.put('/stage/:stageNumber', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const stageNumber = parseInt(req.params.stageNumber)
  const userId = req.actorUserId!
  const currentProfile = db.getUser(userId)

  if (!currentProfile) {
    res.status(404).json({ error: 'Profile not found.' })
    return
  }

  if (isNaN(stageNumber) || stageNumber < 1 || stageNumber > 6) {
    res.status(400).json({ error: 'stageNumber must be an integer between 1 and 6.' })
    return
  }

  const { updates } = req.body
  if (!updates || typeof updates !== 'object') {
    res.status(400).json({ error: 'Payload must contain an updates object.' })
    return
  }

  // Merge progressive disclosure stage updates
  const updatedProfile: UniversalUserProfile = {
    ...currentProfile,
    ...updates,
    completionStage: Math.max(currentProfile.completionStage, stageNumber),
  }

  db.updateUser(userId, updatedProfile)

  res.json({
    message: `Stage ${stageNumber} profile attributes updated successfully.`,
    completionStage: updatedProfile.completionStage,
    profile: updatedProfile,
  })
})
