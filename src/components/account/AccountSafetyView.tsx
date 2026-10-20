// ============================================================================
// src/components/account/AccountSafetyView.tsx
// Checkmate Safety Centre: Verification, Date Check-in & Emergency Protocols
// ============================================================================

import React from 'react'
import { ArrowLeft, PhoneCall } from 'lucide-react'
import { APP_CONFIG } from '../../config/appConfig'

interface AccountSafetyViewProps {
  onBack: () => void
  isSafetyCheckinActive: boolean
  onToggleSafetyCheckin: () => void
}

export const AccountSafetyView: React.FC<AccountSafetyViewProps> = ({
  onBack,
  isSafetyCheckinActive,
  onToggleSafetyCheckin,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center space-x-3 pt-2 pb-1">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Safety Centre</h1>
          <p className="text-xs text-neutral-400 font-light">Verification, reporting &amp; meeting safety</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Identity Verification Status Card */}
        <div className="p-5 rounded-2xl bg-[#17161A] border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold">
              Identity Verification
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium">
              Active
            </span>
          </div>
          <p className="text-xs text-neutral-300 font-light">
            Your profile was verified via biometric liveness proof. We never store raw scans; verification produces a cryptographic hash verifying authentic human identity.
          </p>
        </div>

        {/* Date Safe Check-in Card */}
        <div className="p-5 rounded-2xl bg-[#17161A] border border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">First Date Safety Check-In</h3>
              <p className="text-xs text-neutral-400 font-light">Share your date venue &amp; check-in time with a trusted friend</p>
            </div>
            <button
              type="button"
              onClick={onToggleSafetyCheckin}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${
                isSafetyCheckinActive
                  ? 'bg-emerald-500 text-black'
                  : 'bg-white/10 text-white hover:bg-white/15'
              }`}
            >
              {isSafetyCheckinActive ? 'Active' : 'Setup'}
            </button>
          </div>
        </div>

        {/* Meeting Ground Rules */}
        <div className="p-5 rounded-2xl bg-[#17161A] border border-white/[0.08] space-y-3">
          <h3 className="text-sm font-semibold text-white">Meeting Ground Rules</h3>
          <ul className="text-xs text-neutral-300 space-y-2 list-disc list-inside font-light">
            <li>Meet in public, well-lit spaces for all first encounters.</li>
            <li>Stay in control of your own transport to and from the venue.</li>
            <li>Never feel pressured to stay if boundaries are breached.</li>
            <li>{APP_CONFIG.brand.name} provides discreet exit options inside the Date Plan tool.</li>
          </ul>
        </div>

        {/* Emergency Hotline Assistance */}
        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-rose-300 block">Emergency SOS Contacts</span>
            <span className="text-[11px] text-neutral-400">Quick-dial emergency services (999 / 112 / 911)</span>
          </div>
          <a
            href="tel:999"
            className="px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 999</span>
          </a>
        </div>
      </div>
    </div>
  )
}
