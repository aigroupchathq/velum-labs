// ============================================================================
// src/components/navigation/TabBar.tsx
// Checkmate iOS Canonical Bottom Tab Bar
// Apple HIG Ergonomic Navigation with Haptic Feedback & Safe-Area Padding
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
      label: 'Connections',
      icon: MessageSquare,
      badge: unreadConnectionsCount > 0 ? unreadConnectionsCount : undefined,
    },
    {
      id: 'constellation',
      label: 'Constellation',
      icon: Compass,
    },
    {
      id: 'profile',
      label: 'My Sanctuary',
      icon: User,
    },
  ]

  const handleTabPress = (tabId: MainTab) => {
    sounds.playTap()
    onSelectTab(tabId)
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0F0E11]/85 backdrop-blur-2xl border-t border-white/[0.08] transition-all"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)',
      }}
      aria-label="Bottom Navigation"
    >
      <div className="max-w-md mx-auto px-4 pt-2.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => handleTabPress(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-white'
                  : 'text-neutral-400 hover:text-neutral-200 active:scale-95'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-[#F472B6]' : 'text-neutral-400'
                  }`}
                />
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#F472B6] text-black text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-white font-semibold' : 'text-neutral-400'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#F472B6] shadow-[0_0_8px_#F472B6]" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
