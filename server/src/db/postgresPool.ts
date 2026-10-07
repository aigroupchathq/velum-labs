// ============================================================================
// server/src/db/postgresPool.ts
// Production PostgreSQL Connection Pool Abstraction & Telemetry Engine
// Conforms to: DATA_MODEL.md, ARCHITECTURE_REVIEW.md, Phase 12 Production Architecture
// ============================================================================

import pg from 'pg'
import { performance } from 'perf_hooks'

const { Pool } = pg

export interface PoolTelemetry {
  totalQueries: number
  slowQueries: number
  errorCount: number
  totalDurationMs: number
  avgDurationMs: number
  lastQueryTimeMs: number
  activeClients: number
  idleClients: number
  waitingClients: number
}

export interface PoolHealthStatus {
  healthy: boolean
  database: string
  latencyMs: number
  error?: string
  stats: PoolTelemetry
}

class PostgresConnectionPool {
  private pool: pg.Pool | null = null
  private isConfigured = false
  private connectionString: string | null = null

  private telemetry: PoolTelemetry = {
    totalQueries: 0,
    slowQueries: 0,
    errorCount: 0,
    totalDurationMs: 0,
    avgDurationMs: 0,
    lastQueryTimeMs: 0,
    activeClients: 0,
    idleClients: 0,
    waitingClients: 0,
  }

  constructor() {
    this.initPool()
  }

  private initPool(): void {
    // 1. Resolve connection parameters
    const envUrl = process.env.DATABASE_URL
    const host = process.env.POSTGRES_HOST || process.env.PGHOST
    const port = parseInt(process.env.POSTGRES_PORT || process.env.PGPORT || '5432', 10)
    const user = process.env.POSTGRES_USER || process.env.PGUSER || 'modest_admin'
    const password = process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD || 'modest_secure_pass_2026'
    const database = process.env.POSTGRES_DB || process.env.PGDATABASE || 'modest_compatibility_db'

    if (envUrl) {
      this.connectionString = envUrl
      this.isConfigured = true
    } else if (host) {
      this.connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`
      this.isConfigured = true
    } else {
      // Offline / In-memory test runner mode
      this.connectionString = null
      this.isConfigured = false
    }

    if (!this.isConfigured || !this.connectionString) {
      return
    }

    const max = parseInt(process.env.PG_POOL_MAX || '20', 10)
    const min = parseInt(process.env.PG_POOL_MIN || '2', 10)
    const idleTimeoutMillis = parseInt(process.env.PG_IDLE_TIMEOUT_MS || '30000', 10)
    const connectionTimeoutMillis = parseInt(process.env.PG_CONN_TIMEOUT_MS || '3000', 10)

    try {
      this.pool = new Pool({
        connectionString: this.connectionString,
        max,
        min,
        idleTimeoutMillis,
        connectionTimeoutMillis,
        keepAlive: true,
        ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
      })

      // Lifecycle listeners
      this.pool.on('connect', () => {
        this.updateClientCounts()
      })

      this.pool.on('acquire', () => {
        this.updateClientCounts()
      })

      this.pool.on('remove', () => {
        this.updateClientCounts()
      })

      this.pool.on('error', (err) => {
        console.error('[PG-POOL ERROR] Unexpected client error on idle client:', err.message)
        this.telemetry.errorCount++
      })
    } catch (err: any) {
      console.warn('[PG-POOL INIT WARNING] Failed to initialize pg.Pool:', err.message)
      this.pool = null
    }
  }

  private updateClientCounts(): void {
    if (!this.pool) return
    this.telemetry.activeClients = this.pool.totalCount - this.pool.idleCount
    this.telemetry.idleClients = this.pool.idleCount
    this.telemetry.waitingClients = this.pool.waitingCount
  }

  public isPoolConfigured(): boolean {
    return this.isConfigured && this.pool !== null
  }

  /**
   * Safe parameterized query with latency instrumentation and slow-query alerting (>50ms)
   */
  public async query<T = any>(text: string, params?: any[]): Promise<pg.QueryResult<T>> {
    if (!this.pool) {
      throw new Error('PostgreSQL pool is not configured or offline.')
    }

    const start = performance.now()
    try {
      const result = await this.pool.query<T>(text, params)
      const duration = performance.now() - start

      this.telemetry.totalQueries++
      this.telemetry.lastQueryTimeMs = duration
      this.telemetry.totalDurationMs += duration
      this.telemetry.avgDurationMs = this.telemetry.totalDurationMs / this.telemetry.totalQueries

      if (duration > 50) {
        this.telemetry.slowQueries++
        console.warn(`[PG-POOL SLOW QUERY ${duration.toFixed(2)}ms] ${text.slice(0, 120)}...`)
      }

      this.updateClientCounts()
      return result
    } catch (err: any) {
      this.telemetry.errorCount++
      console.error(`[PG-POOL QUERY ERROR] ${err.message} (SQL: ${text.slice(0, 80)}...)`)
      throw err
    }
  }

  /**
   * Healthcheck probing query (SELECT 1) with bounded 2000ms timeout
   */
  public async checkHealth(): Promise<PoolHealthStatus> {
    this.updateClientCounts()

    if (!this.pool) {
      return {
        healthy: false,
        database: 'in-memory-fallback',
        latencyMs: 0,
        error: 'PostgreSQL connection pool not initialized (operating in fallback mode).',
        stats: { ...this.telemetry },
      }
    }

    const start = performance.now()
    try {
      // Execute health check with promise timeout race
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Healthcheck query timeout (2000ms exceeded)')), 2000)
      )

      await Promise.race([
        this.pool.query('SELECT 1 AS live, current_database() AS db, NOW() AS now'),
        timeoutPromise,
      ])

      const latency = performance.now() - start
      return {
        healthy: true,
        database: this.pool.options.database || 'modest_compatibility_db',
        latencyMs: parseFloat(latency.toFixed(2)),
        stats: { ...this.telemetry },
      }
    } catch (err: any) {
      const latency = performance.now() - start
      return {
        healthy: false,
        database: this.pool.options.database || 'unknown',
        latencyMs: parseFloat(latency.toFixed(2)),
        error: err.message,
        stats: { ...this.telemetry },
      }
    }
  }

  public getStats(): PoolTelemetry {
    this.updateClientCounts()
    return { ...this.telemetry }
  }

  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end()
      this.pool = null
      this.isConfigured = false
    }
  }
}

export const postgresPool = new PostgresConnectionPool()
