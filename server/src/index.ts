// ============================================================================
// server/src/index.ts
// Universal Compatibility Platform: Backend API Service Server
// Governing Standards: Master Build Prompt §2, §7, §14–§17, §31–§35
// ============================================================================

import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { matchingRouter } from './routes/matching.js'
import { preferencesRouter } from './routes/preferences.js'
import { profileRouter } from './routes/profile.js'
import { safetyRouter } from './routes/safety.js'
import { privacyRouter } from './routes/privacy.js'
import { subscriptionsRouter } from './routes/subscriptions.js'
import { betaRouter } from './routes/beta.js'
import { db } from './data/dbStore.js'
import { postgresPool } from './db/postgresPool.js'
import { matchPool } from './workers/matchPool.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Environment-Based Explicit CORS Configuration (Gate 4 Security Fix)
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
]

const envAllowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : []

const allowedOrigins = new Set([...defaultAllowedOrigins, ...envAllowedOrigins])

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)
      if (allowedOrigins.has(origin)) return callback(null, true)
      if (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost:')) {
        return callback(null, true)
      }
      callback(new Error(`CORS Security Violation: Origin '${origin}' is not allowed by explicit CORS policy.`))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-User-ID', 'X-Simulate-Network', 'X-Authenticated-User'],
  })
)
app.use(express.json())

// Request Logging & Traceability
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`[API ${timestamp}] ${req.method} ${req.url}`)
  next()
})

// Apple Network Link Conditioner Simulation Middleware
app.use((req, res, next) => {
  const sim = req.headers['x-simulate-network']
  if (!sim) return next()

  if (sim === 'subway_tunnel') {
    // 100% loss / connection blackout simulation
    return setTimeout(() => {
      res.status(503).json({
        error: 'Network connectivity lost (Subway Tunnel Blackout simulated)',
        offline: true,
        retryAfterMs: 2000,
      })
    }, 50)
  }

  if (sim === 'lossy_3g') {
    // 250ms latency + 25% random drop simulation unless retried
    const isRetry = Boolean(req.headers['x-retry-attempt'])
    const drop = Math.random() < 0.25 && !isRetry
    return setTimeout(() => {
      if (drop) {
        res.status(504).json({
          error: 'Gateway timeout (Lossy 3G Packet Drop simulated)',
          retryable: true,
        })
      } else {
        next()
      }
    }, 150)
  }

  next()
})

// Mount API v1 Routers (API_SPEC.md)
app.use('/api/v1/matching', matchingRouter)
app.use('/api/v1/recommendations', matchingRouter) // Alias for /api/v1/recommendations
app.use('/api/v1/preferences', preferencesRouter)
app.use('/api/v1/profile', profileRouter)
app.use('/api/v1/safety', safetyRouter)
app.use('/api/v1/privacy', privacyRouter)
app.use('/api/v1/subscriptions', subscriptionsRouter)
app.use('/api/v1/beta', betaRouter)

// Healthcheck & Diagnostic Baseline (Spec §31, Phase 12 Container Orchestration)
app.get('/api/health', async (_req, res) => {
  const pgHealth = await db.checkHealth()
  const poolStats = db.getPoolStats()
  const workerMetrics = matchPool.getMetrics()

  res.json({
    status: 'healthy',
    service: 'universal-compatibility-engine',
    version: '1.0.0',
    deterministic: true,
    mlFree: true,
    database: {
      connected: db.isPostgresConnected(),
      configured: postgresPool.isPoolConfigured(),
      health: pgHealth,
      pool: poolStats,
    },
    workers: {
      active: workerMetrics.workerThreadsActive,
      poolSize: workerMetrics.poolSize,
      totalEvaluations: workerMetrics.totalEvaluations,
      avgLatencyMs: workerMetrics.avgLatencyMs,
    },
  })
})

// Production Liveness Probe
app.get('/health/live', (_req, res) => {
  res.status(200).json({ status: 'live', timestamp: new Date().toISOString() })
})

// Production Readiness Probe
app.get('/health/ready', async (_req, res) => {
  const pgHealth = await db.checkHealth()
  const workers = matchPool.getMetrics()

  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString(),
    postgresConfigured: postgresPool.isPoolConfigured(),
    postgresConnected: db.isPostgresConnected(),
    postgresHealthy: pgHealth.healthy,
    workersActive: workers.workerThreadsActive,
  })
})

// Production Static Client Serving (Phase 12 Docker Container)
const distPath = path.resolve(__dirname, '../../dist')
app.use(express.static(distPath))
app.use((req, res, next) => {
  if (req.url.startsWith('/api') || req.url.startsWith('/health')) {
    return next()
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next()
  })
})

export { app }

const isMainModule = Boolean(process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename))

if (isMainModule && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`===============================================================`)
    console.log(`UNIVERSAL COMPATIBILITY PLATFORM: BACKEND API SERVICE`)
    console.log(`Listening on http://localhost:${PORT}`)
    console.log(`PostgreSQL Pool Configured: ${postgresPool.isPoolConfigured()}`)
    console.log(`Match Worker Thread Pool: Active (${matchPool.getMetrics().poolSize} workers)`)
    console.log(`===============================================================`)
  })
}
