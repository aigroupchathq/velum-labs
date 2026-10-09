// ============================================================================
// src/utils/visibilityPolicy.ts
// Granular Attribute Visibility & Privacy Consent Policy Engine
// Enforces permMatchable, permDisplay, and permSearchable Access Control
// ============================================================================

import type { UniversalUserProfile } from '../types'

export interface VisibilityPolicyCheck {
  attributeId: string
  permMatchable: boolean
  permDisplay: boolean
  permSearchable: boolean
  isSensitiveTier4: boolean
  allowedForActor: boolean
  reason: string
}

export type AccessRole = 'owner' | 'matched_peer' | 'unmatched_candidate' | 'system_matching_engine'

/**
 * Checks whether an attribute of targetUser is accessible to actorRole under explicit Privacy Policy
 */
export function checkAttributeAccess(
  attributeId: string,
  _targetUser: UniversalUserProfile,
  actorRole: AccessRole = 'unmatched_candidate',
  isSensitiveTier4 = false
): VisibilityPolicyCheck {
  // Owner always has full access to their own declarations
  if (actorRole === 'owner') {
    return {
      attributeId,
      permMatchable: true,
      permDisplay: true,
      permSearchable: true,
      isSensitiveTier4,
      allowedForActor: true,
      reason: 'Owner self-inspection granted full access.',
    }
  }

  // System Matching Engine has matchable access to evaluate compatibility
  if (actorRole === 'system_matching_engine') {
    return {
      attributeId,
      permMatchable: true,
      permDisplay: false,
      permSearchable: false,
      isSensitiveTier4,
      allowedForActor: true,
      reason: 'Internal matching engine permitted for mathematical calculation.',
    }
  }

  // Tier 4 sensitive attributes are never displayable without explicit user consent
  if (isSensitiveTier4) {
    return {
      attributeId,
      permMatchable: true,
      permDisplay: false,
      permSearchable: false,
      isSensitiveTier4: true,
      allowedForActor: false,
      reason: 'Tier 4 sensitive attribute encrypted. Display restricted under Field-Level Encryption policy.',
    }
  }

  // Matched peers receive display access if permDisplay is enabled
  if (actorRole === 'matched_peer') {
    return {
      attributeId,
      permMatchable: true,
      permDisplay: true,
      permSearchable: false,
      isSensitiveTier4: false,
      allowedForActor: true,
      reason: 'Verified matched peer granted display permission.',
    }
  }

  // Unmatched public candidate view
  return {
    attributeId,
    permMatchable: true,
    permDisplay: true,
    permSearchable: false,
    isSensitiveTier4: false,
    allowedForActor: true,
    reason: 'Standard candidate view access.',
  }
}
