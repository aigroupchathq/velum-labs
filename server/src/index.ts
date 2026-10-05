// ============================================================================
// server/src/index.ts
// Universal Compatibility Platform: Backend API Service Server
// Governing Standards: Master Build Prompt §2, §7, §14–§17, §31–§35
// ============================================================================

import express from 'express'
import cors from 'cors'
import { matchingRouter } from './routes/matching.js'
import { preferencesRouter } from './routes/preferences.js'
import { profileRouter } from './routes/profile.js'
import { safetyRouter } from './routes/safety.js'
import { privacyRouter } from './routes/privacy.js'

const app = express()
const PORT = process.env.PORT || 3001

// Global Middleware
app.use(cors())
app.use(express.json())

// Request Logging & Traceability
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`[API ${timestamp}] ${req.method} ${req.url}`)
  next()
})

// Mount API v1 Routers (API_SPEC.md)
app.use('/api/v1/matching', matchingRouter)
app.use('/api/v1/recommendations', matchingRouter) // Alias for /api/v1/recommendations
app.use('/api/v1/preferences', preferencesRouter)
app.use('/api/v1/profile', profileRouter)
app.use('/api/v1/safety', safetyRouter)
app.use('/api/v1/privacy', privacyRouter)

// Healthcheck & Diagnostic Baseline
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'universal-compatibility-engine',
    version: '1.0.0',
    deterministic: true,
    mlFree: true,
  })
})

export { app }

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`===============================================================`)
    console.log(`UNIVERSAL COMPATIBILITY PLATFORM: BACKEND API SERVICE`)
    console.log(`Listening on http://localhost:${PORT}`)
    console.log(`===============================================================`)
  })
}
