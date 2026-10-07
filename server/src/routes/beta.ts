// ============================================================================
// server/src/routes/beta.ts
// KIN: Human Compatibility & Relationship-Discovery Platform
// Phase 13: Controlled Beta, Cohort Gate & Encounter Feedback Endpoints
// ============================================================================

import { Router, Request, Response } from 'express'
import { db } from '../data/dbStore.js'

export const betaRouter = Router()

/**
 * GET /api/v1/beta/cohorts
 * List active geographic cohorts and saturation metrics
 */
betaRouter.get('/cohorts', (_req: Request, res: Response) => {
  const cohorts = db.listCohorts()
  res.json({
    success: true,
    cohorts,
  })
})

/**
 * POST /api/v1/beta/invites/verify
 * Validate invite code prior to account onboarding
 */
betaRouter.post('/invites/verify', (req: Request, res: Response) => {
  const { code } = req.body
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Invite code is required.' })
  }

  const result = db.verifyInviteCode(code)
  if (!result.valid) {
    return res.status(403).json({ success: false, message: result.message })
  }

  res.json({
    success: true,
    message: result.message,
    invite: result.invite,
  })
})

/**
 * POST /api/v1/beta/invites/claim
 * Claim invite code for authenticated user
 */
betaRouter.post('/invites/claim', (req: Request, res: Response) => {
  const { code, userId } = req.body
  if (!code || !userId) {
    return res.status(400).json({ error: 'Code and userId are required.' })
  }

  const success = db.claimInviteCode(code, userId)
  if (!success) {
    return res.status(400).json({ error: 'Unable to claim invite code. Check status or validity.' })
  }

  res.json({
    success: true,
    message: `Invite code ${code} successfully registered to user ${userId}.`,
  })
})

/**
 * POST /api/v1/beta/feedback
 * Submit clinical post-encounter feedback
 */
betaRouter.post('/feedback', (req: Request, res: Response) => {
  const {
    encounterId,
    evaluatorUserId,
    partnerUserId,
    feltSafe,
    sensoryVenueComfort,
    desireSecondEncounter,
    gracefulClosureRequested,
    sentiments,
    qualitativeNotes,
  } = req.body

  if (!encounterId || !evaluatorUserId || !partnerUserId) {
    return res.status(400).json({
      error: 'encounterId, evaluatorUserId, and partnerUserId are required fields.',
    })
  }

  const record = db.recordEncounterFeedback({
    encounterId,
    evaluatorUserId,
    partnerUserId,
    feltSafe: feltSafe ?? true,
    sensoryVenueComfort: sensoryVenueComfort || 4,
    desireSecondEncounter: desireSecondEncounter ?? false,
    gracefulClosureRequested: gracefulClosureRequested ?? false,
    sentiments: sentiments || [],
    qualitativeNotes: qualitativeNotes || '',
  })

  res.status(201).json({
    success: true,
    message: 'Post-encounter reflection successfully recorded in audit log.',
    feedbackId: record.id,
    record,
  })
})

/**
 * GET /api/v1/beta/feedback
 * Query feedbacks for a specific user
 */
betaRouter.get('/feedback', (req: Request, res: Response) => {
  const userId = req.query.userId as string | undefined
  const feedbacks = db.getEncounterFeedbacks(userId)
  res.json({
    success: true,
    feedbacks,
  })
})
