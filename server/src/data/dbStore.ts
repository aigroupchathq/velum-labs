// ============================================================================
// server/src/data/dbStore.ts
// In-Memory Database Store simulating PostgreSQL normalized relational model
// Conforms to: DATA_MODEL.md, ONTOLOGY.md, and ATTRIBUTE_DICTIONARY.md
// ============================================================================

import { UniversalUserProfile } from '../../../src/types/index.js'
import { currentUser, mockCandidates } from '../../../src/data/mockProfiles.js'

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

export class DatabaseStore {
  private users: Map<string, UniversalUserProfile> = new Map()
  private auditLogs: AuditLogEntry[] = []
  private blocks: BlockEntry[] = []
  private reports: ReportEntry[] = []
  private interactions: InteractionEntry[] = []
  private messages: MessageEntry[] = []
  private nextAuditId = 1
  private nextInteractionId = 1

  constructor() {
    // Populate with canonical users
    canonicalUsers.forEach((user) => {
      this.users.set(user.id, JSON.parse(JSON.stringify(user)))
    })

    this.logAudit(null, 'system', 'INIT_DATABASE_STORE', 'database', 'system', {
      initialUserCount: this.users.size,
    })
  }

  // --- Users & Profiles ---
  public getUser(id: string): UniversalUserProfile | undefined {
    return this.users.get(id)
  }

  public getAllUsers(): UniversalUserProfile[] {
    return Array.from(this.users.values())
  }

  public updateUser(id: string, updated: UniversalUserProfile): boolean {
    if (!this.users.has(id)) return false
    this.users.set(id, updated)
    this.logAudit(id, 'user', 'UPDATE_PROFILE', 'profile', id, { stage: updated.completionStage })
    return true
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
    return msg
  }

  public getMessages(connectionId: string): MessageEntry[] {
    return this.messages.filter((m) => m.connectionId === connectionId)
  }
}

export const db = new DatabaseStore()
