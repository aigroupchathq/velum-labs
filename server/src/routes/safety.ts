// ============================================================================
// server/src/routes/safety.ts
// Safety, Blocks, Reports, and Audit Trail (SAFETY_SPEC.md & SECURITY_SPEC.md)
// Protected with requireAuth & authorizeSelf
// ============================================================================

import { Router, Response } from 'express'
import { db } from '../data/dbStore.js'
import { requireAuth, authorizeSelf, AuthenticatedRequest } from '../middleware/auth.js'

export const safetyRouter = Router()

// POST /api/v1/safety/block
safetyRouter.post('/block', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const { blockerId, blockedId } = req.body
  const actorId = blockerId || req.actorUserId!

  if (!authorizeSelf(actorId, req, res)) return

  if (!actorId || !blockedId) {
    res.status(400).json({ error: 'Both blockerId and blockedId are required.' })
    return
  }

  if (actorId === blockedId) {
    res.status(400).json({ error: 'A user cannot block themselves.' })
    return
  }

  const success = db.addBlock(actorId, blockedId)
  res.json({ success, message: 'User blocked bidirectionally across all matching indices.' })
})

// POST /api/v1/safety/report
safetyRouter.post('/report', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  const { reporterId, reportedId, reason, details } = req.body
  const actorId = reporterId || req.actorUserId!

  if (!authorizeSelf(actorId, req, res)) return

  if (!actorId || !reportedId || !reason) {
    res.status(400).json({ error: 'reporterId, reportedId, and reason are required.' })
    return
  }

  const report = db.addReport(actorId, reportedId, reason, details)
  res.status(201).json({ report, message: 'Report logged for review.' })
})

// GET /api/v1/safety/audit-logs (Admin / Compliance Inspection)
safetyRouter.get('/audit-logs', requireAuth, (_req: AuthenticatedRequest, res: Response): void => {
  const logs = db.getAuditLogs()
  res.json({ count: logs.length, logs })
})
