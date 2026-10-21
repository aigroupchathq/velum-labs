// ============================================================================
// src/components/account/AccountNotificationsView.tsx
// Subview: Notifications Settings
// ============================================================================

import React from 'react'
import { ArrowLeft } from 'lucide-react'

interface AccountNotificationsViewProps {
  notificationsState: {
    mutualAlignments: boolean
    thoughtfulMessages: boolean
    dateProposals: boolean
    dailySanctuaryDigest: boolean
  }
  onToggleNotification: (key: 'mutualAlignments' | 'thoughtfulMessages' | 'dateProposals' | 'dailySanctuaryDigest', label: string) => void
  onBack: () => void
}

export const AccountNotificationsView: React.FC<AccountNotificationsViewProps> = ({
  notificationsState,
  onToggleNotification,
  onBack,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center space-x-3 pt-2 pb-1">
        <button
          onClick={onBack}
          className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-xs text-neutral-400 font-light">Configure your alert frequency</p>
        </div>
      </div>

      <div className="bg-[#17161A] border border-white/[0.08] rounded-3xl divide-y divide-white/[0.06] overflow-hidden">
        {[
          {
            key: 'mutualAlignments' as const,
            label: 'Mutual Alignments',
            desc: 'Alert me when someone reciprocates my connection request.',
          },
          {
            key: 'thoughtfulMessages' as const,
            label: 'Direct Messages',
            desc: 'Alert me when a conversation partner sends a message.',
          },
          {
            key: 'dateProposals' as const,
            label: 'Date Proposals & Briefs',
            desc: 'Alert me when a date plan is created or modified.',
          },
          {
            key: 'dailySanctuaryDigest' as const,
            label: 'Quiet Evening Digest',
            desc: 'Batch notifications into a single calm summary at 8:00 PM.',
          },
        ].map((n) => {
          const active = notificationsState[n.key]
          return (
            <div key={n.key} className="p-4 sm:p-5 flex items-center justify-between">
              <div className="pr-4">
                <h3 className="text-sm font-semibold text-white">{n.label}</h3>
                <p className="text-xs text-neutral-400 font-light mt-0.5">{n.desc}</p>
              </div>
              <button
                onClick={() => onToggleNotification(n.key, n.label)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                  active ? 'bg-[#F472B6]' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    active ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
