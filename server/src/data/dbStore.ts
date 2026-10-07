// ============================================================================
// server/src/data/dbStore.ts
// Relational Database Store with PostgreSQL Connection Pooling & In-Memory Fallback
// Conforms to: DATA_MODEL.md, ONTOLOGY.md, ARCHITECTURE_REVIEW.md D-23, Spec §31–§35
// ============================================================================

import { UniversalUserProfile } from '../../../src/types/index.js'
import { currentUser, mockCandidates } from '../../../src/data/mockProfiles.js'
import { postgresPool, type PoolTelemetry, type PoolHealthStatus } from '../db/postgresPool.js'

export const canonicalUsers = [currentUser, ...mockCandidates]

export interface AuditLogEntry {
  id: number
  actorId: string | null
  actorRole: string
  action: string
  targetType: string
  targetId: string | null
  detail: Record<string, any>
  createdAt: string
}

export interface BlockEntry {
  blockerId: string
  blockedId: string
  createdAt: string
}

export interface ReportEntry {
  id: string
  reporterId: string
  reportedId: string
  reason: string
  details?: string
  status: 'pending' | 'reviewed' | 'resolved'
  createdAt: string
}

export interface InteractionEntry {
  id: number
  actorId: string
  targetId: string
  type: 'interest' | 'pass' | 'unmatch'
  createdAt: string
}

export interface MessageEntry {
  id: string
  connectionId: string
  senderId: string
  body: string
  createdAt: string
}

export interface EncryptedAttributeRecord {
  userId: string
  attributeId: string
  encryptedPayload: any
  permMatchable: boolean
  permDisplay: boolean
  createdAt: string
}

export class DatabaseStore {
  private users: Map<string, UniversalUserProfile> = new Map()
  private encryptedTier4Attributes: Map<string, EncryptedAttributeRecord> = new Map()
  private auditLogs: AuditLogEntry[] = []
  private blocks: BlockEntry[] = []
  private reports: ReportEntry[] = []
  private interactions: InteractionEntry[] = []
  private messages: MessageEntry[] = []
  private nextAuditId = 1
  private nextInteractionId = 1
  private isPostgresReady = false

  // Monetization & Phase 11 Subscriptions
  private subscriptions: Map<string, any> = new Map()
  private payments: Map<string, any> = new Map()

  // Phase 13 Controlled Beta
  private cohorts: Map<string, any> = new Map([
    [
      'cohort_sf_01',
      {
        id: 'cohort_sf_01',
        name: 'Metropolis Foundational Cohort',
        geographicCluster: 'Metropolis',
        maxParticipants: 50,
        currentParticipants: 12,
        status: 'active',
        createdAt: '2026-10-01T00:00:00Z',
      },
    ],
  ])

  private invites: Map<string, any> = new Map([
    [
      'KIN-FOUNDER-2026',
      {
        code: 'KIN-FOUNDER-2026',
        cohortId: 'cohort_sf_01',
        issuedByUserId: 'system',
        claimedByUserId: null,
        status: 'available',
        createdAt: '2026-10-01T00:00:00Z',
      },
    ],
    [
      'KIN-BETA-DYAD',
      {
        code: 'KIN-BETA-DYAD',
        cohortId: 'cohort_sf_01',
        issuedByUserId: 'system',
        claimedByUserId: null,
        status: 'available',
        createdAt: '2026-10-01T00:00:00Z',
      },
    ],
  ])

  private encounterFeedbacks: any[] = []

  constructor() {
    // Populate high-speed in-memory cache with canonical users
    canonicalUsers.forEach((user) => {
      this.users.set(user.id, JSON.parse(JSON.stringify(user)))
    })

    this.logAudit(null, 'system', 'INIT_DATABASE_STORE', 'database', 'system', {
      initialUserCount: this.users.size,
      postgresConfigured: postgresPool.isPoolConfigured(),
    })

    // If PostgreSQL connection pool is available, initialize synchronization
    if (postgresPool.isPoolConfigured()) {
      this.initPostgresStore().catch((err) => {
        console.warn('[DB-STORE WARN] Background PostgreSQL sync initialization deferred:', err.message)
      })
    }
  }

  private async initPostgresStore(): Promise<void> {
    try {
      const health = await postgresPool.checkHealth()
      if (!health.healthy) {
        console.log('[DB-STORE] PostgreSQL pool offline or unreachable. Active in-memory fallback mode.')
        return
      }

      console.log(`[DB-STORE] Connected to PostgreSQL (${health.database}) via connection pool.`)

      // Ensure operational tables exist
      await postgresPool.query(`
        CREATE TABLE IF NOT EXISTS store_users (
          id VARCHAR(128) PRIMARY KEY,
          profile_data JSONB NOT NULL,
          completion_stage SMALLINT NOT NULL DEFAULT 1,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS store_encrypted_tier4 (
          user_id VARCHAR(128) NOT NULL,
          attribute_id VARCHAR(128) NOT NULL,
          encrypted_payload JSONB NOT NULL,
          perm_matchable BOOLEAN NOT NULL DEFAULT FALSE,
          perm_display BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (user_id, attribute_id)
        );
        CREATE TABLE IF NOT EXISTS store_blocks (
          blocker_id VARCHAR(128) NOT NULL,
          blocked_id VARCHAR(128) NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (blocker_id, blocked_id)
        );
        CREATE TABLE IF NOT EXISTS store_reports (
          id VARCHAR(128) PRIMARY KEY,
          reporter_id VARCHAR(128) NOT NULL,
          reported_id VARCHAR(128) NOT NULL,
          reason TEXT NOT NULL,
          details TEXT,
          status VARCHAR(32) NOT NULL DEFAULT 'pending',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS store_interactions (
          id BIGSERIAL PRIMARY KEY,
          actor_id VARCHAR(128) NOT NULL,
          target_id VARCHAR(128) NOT NULL,
          interaction_type VARCHAR(32) NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS store_messages (
          id VARCHAR(128) PRIMARY KEY,
          connection_id VARCHAR(128) NOT NULL,
          sender_id VARCHAR(128) NOT NULL,
          body TEXT NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS store_audit_logs (
          id BIGSERIAL PRIMARY KEY,
          actor_id VARCHAR(128),
          actor_role VARCHAR(64) NOT NULL,
          action VARCHAR(128) NOT NULL,
          target_type VARCHAR(64) NOT NULL,
          target_id VARCHAR(128),
          detail JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `)

      // Check if store_users has data
      const checkUsers = await postgresPool.query('SELECT id, profile_data FROM store_users')
      if (checkUsers.rows.length === 0) {
        // Seed canonical users into PostgreSQL
        for (const user of canonicalUsers) {
          await postgresPool.query(
            'INSERT INTO store_users (id, profile_data, completion_stage) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
            [user.id, JSON.stringify(user), user.completionStage || 1]
          )
        }
        console.log(`[DB-STORE] Seeded ${canonicalUsers.length} canonical user profiles to PostgreSQL.`)
      } else {
        // Hydrate in-memory cache with persisted profiles
        for (const row of checkUsers.rows) {
          const profile = typeof row.profile_data === 'string' ? JSON.parse(row.profile_data) : row.profile_data
          this.users.set(row.id, profile)
        }
        console.log(`[DB-STORE] Synced ${checkUsers.rows.length} profiles from PostgreSQL into cache.`)
      }

      this.isPostgresReady = true
    } catch (err: any) {
      console.warn('[DB-STORE WARN] Postgres synchronization error:', err.message)
      this.isPostgresReady = false
    }
  }

  // --- Users & Profiles ---
  public getUser(id: string): UniversalUserProfile | undefined {
    return this.users.get(id)
  }

  public async getUserAsync(id: string): Promise<UniversalUserProfile | undefined> {
    if (this.isPostgresReady) {
      try {
        const res = await postgresPool.query('SELECT profile_data FROM store_users WHERE id = $1', [id])
        if (res.rows.length > 0) {
          const profile = typeof res.rows[0].profile_data === 'string'
            ? JSON.parse(res.rows[0].profile_data)
            : res.rows[0].profile_data
          this.users.set(id, profile)
          return profile
        }
      } catch (err: any) {
        console.warn(`[DB-STORE] Fallback to cache for user ${id}: ${err.message}`)
      }
    }
    return this.users.get(id)
  }

  public getAllUsers(): UniversalUserProfile[] {
    return Array.from(this.users.values())
  }

  public async getAllUsersAsync(): Promise<UniversalUserProfile[]> {
    if (this.isPostgresReady) {
      try {
        const res = await postgresPool.query('SELECT id, profile_data FROM store_users')
        if (res.rows.length > 0) {
          const loaded: UniversalUserProfile[] = []
          for (const row of res.rows) {
            const profile = typeof row.profile_data === 'string'
              ? JSON.parse(row.profile_data)
              : row.profile_data
            this.users.set(row.id, profile)
            loaded.push(profile)
          }
          return loaded
        }
      } catch (err: any) {
        console.warn(`[DB-STORE] Fallback to cache for all users: ${err.message}`)
      }
    }
    return Array.from(this.users.values())
  }

  public updateUser(id: string, updated: UniversalUserProfile): boolean {
    if (!this.users.has(id)) return false
    this.users.set(id, updated)
    this.logAudit(id, 'user', 'UPDATE_PROFILE', 'profile', id, { stage: updated.completionStage })

    if (this.isPostgresReady) {
      postgresPool.query(
        `INSERT INTO store_users (id, profile_data, completion_stage, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (id) DO UPDATE SET profile_data = $2, completion_stage = $3, updated_at = NOW()`,
        [id, JSON.stringify(updated), updated.completionStage || 1]
      ).catch((err) => console.error('[DB-STORE PG UPDATE ERROR]', err.message))
    }

    return true
  }

  // --- Tier 4 Encrypted Attributes (FLE) ---
  public saveEncryptedAttribute(
    userId: string,
    attributeId: string,
    encryptedPayload: any,
    permMatchable: boolean,
    permDisplay: boolean
  ): EncryptedAttributeRecord {
    const key = `${userId}:${attributeId}`
    const record: EncryptedAttributeRecord = {
      userId,
      attributeId,
      encryptedPayload,
      permMatchable,
      permDisplay,
      createdAt: new Date().toISOString(),
    }
    this.encryptedTier4Attributes.set(key, record)
    this.logAudit(userId, 'user', 'STORE_ENCRYPTED_TIER4', 'attribute_values', attributeId, {
      keyId: encryptedPayload.keyId,
      permMatchable,
      permDisplay,
    })

    if (this.isPostgresReady) {
      postgresPool.query(
        `INSERT INTO store_encrypted_tier4 (user_id, attribute_id, encrypted_payload, perm_matchable, perm_display, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())
         ON CONFLICT (user_id, attribute_id) DO UPDATE SET
           encrypted_payload = $3, perm_matchable = $4, perm_display = $5`,
        [userId, attributeId, JSON.stringify(encryptedPayload), permMatchable, permDisplay]
      ).catch((err) => console.error('[DB-STORE PG ENC ERROR]', err.message))
    }

    return record
  }

  public getEncryptedAttribute(userId: string, attributeId: string): EncryptedAttributeRecord | undefined {
    return this.encryptedTier4Attributes.get(`${userId}:${attributeId}`)
  }

  // --- Audit Logs (WORM: Write-Once-Read-Many) ---
  public logAudit(
    actorId: string | null,
    actorRole: string,
    action: string,
    targetType: string,
    targetId: string | null,
    detail: Record<string, any>
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: this.nextAuditId++,
      actorId,
      actorRole,
      action,
      targetType,
      targetId,
      detail,
      createdAt: new Date().toISOString(),
    }
    this.auditLogs.push(entry)

    if (this.isPostgresReady) {
      postgresPool.query(
        `INSERT INTO store_audit_logs (actor_id, actor_role, action, target_type, target_id, detail, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [actorId, actorRole, action, targetType, targetId, JSON.stringify(detail)]
      ).catch((err) => console.error('[DB-STORE PG AUDIT ERROR]', err.message))
    }

    return entry
  }

  public getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs]
  }

  // --- Safety & Blocks ---
  public addBlock(blockerId: string, blockedId: string): boolean {
    if (blockerId === blockedId) return false
    const existing = this.blocks.find(
      (b) => b.blockerId === blockerId && b.blockedId === blockedId
    )
    if (existing) return true

    this.blocks.push({
      blockerId,
      blockedId,
      createdAt: new Date().toISOString(),
    })
    this.logAudit(blockerId, 'user', 'CREATE_BLOCK', 'user', blockedId, {})

    if (this.isPostgresReady) {
      postgresPool.query(
        `INSERT INTO store_blocks (blocker_id, blocked_id, created_at)
         VALUES ($1, $2, NOW()) ON CONFLICT DO NOTHING`,
        [blockerId, blockedId]
      ).catch((err) => console.error('[DB-STORE PG BLOCK ERROR]', err.message))
    }

    return true
  }

  public isBlocked(userAId: string, userBId: string): boolean {
    return this.blocks.some(
      (b) =>
        (b.blockerId === userAId && b.blockedId === userBId) ||
        (b.blockerId === userBId && b.blockedId === userAId)
    )
  }

  // --- Safety & Reports ---
  public addReport(reporterId: string, reportedId: string, reason: string, details?: string): ReportEntry {
    const report: ReportEntry = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      reporterId,
      reportedId,
      reason,
      details,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    this.reports.push(report)
    this.logAudit(reporterId, 'user', 'SUBMIT_REPORT', 'report', report.id, { reportedId, reason })

    if (this.isPostgresReady) {
      postgresPool.query(
        `INSERT INTO store_reports (id, reporter_id, reported_id, reason, details, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [report.id, reporterId, reportedId, reason, details || null, 'pending']
      ).catch((err) => console.error('[DB-STORE PG REPORT ERROR]', err.message))
    }

    return report
  }

  public getReports(): ReportEntry[] {
    return [...this.reports]
  }

  // --- Interactions & Feedback ---
  public recordInteraction(actorId: string, targetId: string, type: 'interest' | 'pass' | 'unmatch'): InteractionEntry {
    const entry: InteractionEntry = {
      id: this.nextInteractionId++,
      actorId,
      targetId,
      type,
      createdAt: new Date().toISOString(),
    }
    this.interactions.push(entry)
    this.logAudit(actorId, 'user', `INTERACTION_${type.toUpperCase()}`, 'user', targetId, {})

    if (this.isPostgresReady) {
      postgresPool.query(
        `INSERT INTO store_interactions (actor_id, target_id, interaction_type, created_at)
         VALUES ($1, $2, $3, NOW())`,
        [actorId, targetId, type]
      ).catch((err) => console.error('[DB-STORE PG INTERACTION ERROR]', err.message))
    }

    return entry
  }

  // --- Messaging ---
  public sendMessage(connectionId: string, senderId: string, body: string): MessageEntry {
    const msg: MessageEntry = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      connectionId,
      senderId,
      body,
      createdAt: new Date().toISOString(),
    }
    this.messages.push(msg)
    this.logAudit(senderId, 'user', 'SEND_MESSAGE', 'connection', connectionId, {})

    if (this.isPostgresReady) {
      postgresPool.query(
        `INSERT INTO store_messages (id, connection_id, sender_id, body, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [msg.id, connectionId, senderId, body]
      ).catch((err) => console.error('[DB-STORE PG MSG ERROR]', err.message))
    }

    return msg
  }

  public getMessages(connectionId: string): MessageEntry[] {
    return this.messages.filter((m) => m.connectionId === connectionId)
  }

  // --- Phase 11: Subscriptions & Payments Boundary (Spec §33, D-23) ---
  public getSubscription(userId: string): any | undefined {
    return this.subscriptions.get(userId)
  }

  public setSubscription(userId: string, sub: any): void {
    this.subscriptions.set(userId, sub)
    this.logAudit(userId, 'billing', 'UPDATE_SUBSCRIPTION', 'subscription', sub.id, {
      plan: sub.plan,
      status: sub.status,
    })
  }

  public getPaymentByIdempotency(idempotencyKey: string): any | undefined {
    return this.payments.get(idempotencyKey)
  }

  public recordPayment(payment: any): void {
    this.payments.set(payment.idempotencyKey, payment)
    this.logAudit(payment.userId, 'billing', 'PROCESS_PAYMENT', 'payment', payment.id, {
      amountCents: payment.amountCents,
      status: payment.status,
      idempotencyKey: payment.idempotencyKey,
    })
  }

  public getPaymentsForUser(userId: string): any[] {
    return Array.from(this.payments.values()).filter((p) => p.userId === userId)
  }

  // --- Phase 13: Controlled Beta & Encounter Feedback (Spec §34, §38) ---
  public getCohort(id: string): any | undefined {
    return this.cohorts.get(id)
  }

  public listCohorts(): any[] {
    return Array.from(this.cohorts.values())
  }

  public verifyInviteCode(code: string): { valid: boolean; invite?: any; message: string } {
    const invite = this.invites.get(code.toUpperCase().trim())
    if (!invite) {
      return { valid: false, message: 'Invite code does not exist in beta registry.' }
    }
    if (invite.status !== 'available') {
      return { valid: false, message: 'Invite code has already been claimed or revoked.' }
    }
    return { valid: true, invite, message: 'Valid beta cohort invite.' }
  }

  public claimInviteCode(code: string, userId: string): boolean {
    const check = this.verifyInviteCode(code)
    if (!check.valid || !check.invite) return false
    check.invite.status = 'claimed'
    check.invite.claimedByUserId = userId
    check.invite.claimedAt = new Date().toISOString()
    this.logAudit(userId, 'user', 'CLAIM_BETA_INVITE', 'invite', code, {
      cohortId: check.invite.cohortId,
    })
    return true
  }

  public recordEncounterFeedback(feedback: any): any {
    const record = {
      id: `fbk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      ...feedback,
    }
    this.encounterFeedbacks.push(record)
    this.logAudit(
      feedback.evaluatorUserId,
      'user',
      'SUBMIT_ENCOUNTER_FEEDBACK',
      'encounter_feedback',
      record.id,
      {
        partnerUserId: feedback.partnerUserId,
        feltSafe: feedback.feltSafe,
        sensoryComfort: feedback.sensoryVenueComfort,
        desireSecondEncounter: feedback.desireSecondEncounter,
      }
    )

    if (this.isPostgresReady) {
      postgresPool.query(
        `INSERT INTO encounter_feedbacks (id, encounter_id, evaluator_user_id, partner_user_id, felt_safe, sensory_venue_comfort, desire_second_encounter, sentiments, qualitative_notes, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
         ON CONFLICT (id) DO NOTHING`,
        [
          record.id,
          feedback.encounterId || 'enc_default',
          feedback.evaluatorUserId,
          feedback.partnerUserId,
          feedback.feltSafe,
          feedback.sensoryVenueComfort,
          feedback.desireSecondEncounter,
          feedback.sentiments || [],
          feedback.qualitativeNotes || null,
        ]
      ).catch((err) => console.error('[DB-STORE PG FEEDBACK ERROR]', err.message))
    }

    return record
  }

  public getEncounterFeedbacks(userId?: string): any[] {
    if (!userId) return this.encounterFeedbacks
    return this.encounterFeedbacks.filter(
      (f) => f.evaluatorUserId === userId || f.partnerUserId === userId
    )
  }

  // --- Health & Pool Telemetry ---
  public isPostgresConnected(): boolean {
    return this.isPostgresReady
  }

  public async checkHealth(): Promise<PoolHealthStatus> {
    return postgresPool.checkHealth()
  }

  public getPoolStats(): PoolTelemetry {
    return postgresPool.getStats()
  }
}

export const db = new DatabaseStore()
