// ============================================================================
// src/components/navigation/HeaderBar.tsx
// Checkmate iOS Minimalist Top Header Bar
// Brand Wordmark · Location Context · Safety Shield
// ============================================================================

import React from 'react'
import { ShieldCheck, MapPin } from 'lucide-react'
import { sounds } from '../../utils/sound'
import { APP_CONFIG } from '../../config/appConfig'

interface HeaderBarProps {
  cityName?: string
  onOpenSafety?: () => void
  onOpenCityFilter?: () => void
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  cityName = 'London',
  onOpenSafety,
  onOpenCityFilter,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0F0E11]/85 backdrop-blur-xl border-b border-white/[0.06] transition-all">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
        
        {/* Brand & City Context */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="font-extrabold tracking-wider text-base text-white font-sans uppercase">
              {APP_CONFIG.brand.name}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F472B6]" />
          </div>

          <button
            onClick={() => {
              sounds.playTap()
              if (onOpenCityFilter) onOpenCityFilter()
            }}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] text-neutral-300 text-[11px] font-medium transition cursor-pointer"
            title="Filter by city radius"
          >
            <MapPin className="w-3 h-3 text-[#F472B6]" />
            <span>{cityName}</span>
          </button>
        </div>

        {/* Safety Shield */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              sounds.playTap()
              if (onOpenSafety) onOpenSafety()
            }}
            className="p-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] text-neutral-300 hover:text-white transition cursor-pointer flex items-center justify-center"
            aria-label="Safety Centre and Emergency Check-In"
            title="Safety Centre"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

      </div>
    </header>
  )
}
