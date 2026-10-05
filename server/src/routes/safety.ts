// ============================================================================
// server/src/routes/safety.ts
// Safety, Blocks, Reports, and Audit Trail (SAFETY_SPEC.md & SECURITY_SPEC.md)
// ============================================================================

import { Router, Request, Response } from 'express'
import { db } from '../data/dbStore.js'

export const safetyRouter = Router()

// POST /api/v1/safety/block
safetyRouter.post('/block', (req: Request, res: Response): void => {
  const { blockerId, blockedId } = req.body

  if (!blockerId || !blockedId) {
    res.status(400).json({ error: 'Both blockerId and blockedId are required.' })
    return
  }

  if (blockerId === blockedId) {
    res.status(400).json({ error: 'A user cannot block themselves.' })
    return
  }

  const success = db.addBlock(blockerId, blockedId)
  res.json({ success, message: 'User blocked bidirectionally across all matching indices.' })
})

// POST /api/v1/safety/report
safetyRouter.post('/report', (req: Request, res: Response): void => {
  const { reporterId, reportedId, reason, details } = req.body

  if (!reporterId || !reportedId || !reason) {
    res.status(400).json({ error: 'reporterId, reportedId, and reason are required.' })
    return
  }

  const report = db.addReport(reporterId, reportedId, reason, details)
  res.status(201).json({ report, message: 'Report logged for review.' })
})

// GET /api/v1/safety/audit-logs (Admin / Compliance Inspection)
safetyRouter.get('/audit-logs', (_req: Request, res: Response): void => {
  const logs = db.getAuditLogs()
  res.json({ count: logs.length, logs })
})
