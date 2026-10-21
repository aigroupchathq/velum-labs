// ============================================================================
// src/components/account/AccountAppearanceView.tsx
// Subview: Appearance Settings
// ============================================================================

import React from 'react'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

interface AccountAppearanceViewProps {
  themeMode: 'dark' | 'midnight' | 'contrast'
  onSelectTheme: (mode: 'dark' | 'midnight' | 'contrast', label: string) => void
  onBack: () => void
}

export const AccountAppearanceView: React.FC<AccountAppearanceViewProps> = ({
  themeMode,
  onSelectTheme,
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
          <h1 className="text-2xl font-bold text-white">Appearance</h1>
          <p className="text-xs text-neutral-400 font-light">Customise your display theme</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { id: 'dark' as const, label: 'Warm Dark (Default)', desc: '#0F0E11 with pink accents' },
          { id: 'midnight' as const, label: 'Midnight Black', desc: 'Pure #000000 OLED contrast' },
          { id: 'contrast' as const, label: 'High Contrast', desc: 'Enhanced accessibility borders' },
        ].map((t) => (
          <div
            key={t.id}
            onClick={() => onSelectTheme(t.id, t.label)}
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              themeMode === t.id
                ? 'bg-[#17161A] border-[#F472B6] shadow-md shadow-[#F472B6]/10'
                : 'bg-[#17161A]/60 border-white/[0.08] hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between pb-2">
              <span className="text-sm font-semibold text-white">{t.label}</span>
              {themeMode === t.id && <CheckCircle2 className="w-4 h-4 text-[#F472B6]" />}
            </div>
            <p className="text-xs text-neutral-400 font-light">{t.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
