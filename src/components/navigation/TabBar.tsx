// ============================================================================
// src/components/navigation/TabBar.tsx
// Checkmate iOS Canonical Bottom Tab Bar
// Apple HIG Ergonomic Navigation with Haptic Feedback & Safe-Area Insets
// ============================================================================

import React from 'react'
import { Sparkles, MessageSquare, Compass, User } from 'lucide-react'
import { sounds } from '../../utils/sound'

export type MainTab = 'discover' | 'connections' | 'constellation' | 'profile'

interface TabBarProps {
  activeTab: MainTab
  onSelectTab: (tab: MainTab) => void
  unreadConnectionsCount?: number
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onSelectTab,
  unreadConnectionsCount = 1,
}) => {
  const tabs: {
    id: MainTab
    label: string
    icon: React.ComponentType<{ className?: string }>
    badge?: number
  }[] = [
    {
      id: 'discover',
      label: 'Discover',
      icon: Sparkles,
    },
    {
      id: 'connections',
      label: 'Messages',
      icon: MessageSquare,
      badge: unreadConnectionsCount > 0 ? unreadConnectionsCount : undefined,
    },
    {
      id: 'constellation',
      label: 'Radar',
      icon: Compass,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
  ]

  const handleTabPress = (tabId: MainTab) => {
    sounds.playTap()
    onSelectTab(tabId)
  }

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 z-30 bg-[#0C0B0F]/90 backdrop-blur-2xl border-t border-white/[0.08] transition-all select-none"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 10px)',
      }}
      aria-label="Bottom Navigation"
    >
      <div className="w-full px-3 pt-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => handleTabPress(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 cursor-pointer active:scale-90 ${
                isActive
                  ? 'text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${
                    isActive ? 'scale-115 text-[#F472B6] drop-shadow-[0_0_8px_rgba(244,114,182,0.4)]' : 'text-neutral-400'
                  }`}
                />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#F472B6] text-black text-[9px] font-bold flex items-center justify-center shadow-md animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-1 transition-colors duration-200 ${
                  isActive ? 'text-white font-semibold' : 'text-neutral-400'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-[#F472B6] shadow-[0_0_8px_#F472B6] animate-in zoom-in-50 duration-200" />
              )}
            </button>
          )
        })}
      </div>

      {/* iOS Native Home Indicator Bar */}
      <div className="w-32 h-1 bg-white/20 hover:bg-white/30 rounded-full mx-auto mt-2 mb-1 pointer-events-none transition-colors" />
    </nav>
  )
}
