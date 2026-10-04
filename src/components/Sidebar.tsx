import React, { useState } from 'react'
import type { Match, UserProfile } from '../types'
import { Search, Sparkles, Shield, Volume2, VolumeX, Moon, Sun, CheckCircle2, MoreVertical, Trash2 } from 'lucide-react'

interface SidebarProps {
  userProfile: UserProfile
  matches: Match[]
  activeMatchId: string | null
  onSelectMatch: (matchId: string) => void
  onOpenLikesYou: () => void
  onOpenProfile: () => void
  onOpenSafety: () => void
  soundEnabled: boolean
  toggleSound: () => void
  darkMode: boolean
  toggleDarkMode: () => void
  onUnmatch: (matchId: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  userProfile,
  matches,
  activeMatchId,
  onSelectMatch,
  onOpenLikesYou,
  onOpenProfile,
  onOpenSafety,
  soundEnabled,
  toggleSound,
  darkMode,
  toggleDarkMode,
  onUnmatch,
}) => {
  const [activeTab, setActiveTab] = useState<'matches' | 'messages'>('matches')
  const [searchQuery, setSearchQuery] = useState('')
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

  const filteredMatches = matches.filter((m) =>
    m.profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalUnread = matches.reduce((acc, m) => acc + m.unreadCount, 0)

  return (
    <aside className="hidden md:flex flex-col w-80 lg:w-96 h-screen border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111418] shrink-0 z-20">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#111418] border-b border-gray-100 dark:border-gray-800/80">
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-3 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/60 transition group text-left"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-rose-500/70 shadow-sm">
              <img
                src={userProfile.photos[0] || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80'}
                alt={userProfile.name}
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#111418] rounded-full"></span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1 leading-tight">
              {userProfile.name}
              <span className="text-xs text-rose-500 font-semibold">★ Gold</span>
            </h3>
            <span className="text-xs text-gray-400 group-hover:text-rose-500 transition">View profile</span>
          </div>
        </button>

        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <button
            onClick={toggleSound}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-rose-500" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={onOpenSafety}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition text-blue-500"
            title="Safety Center"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gold Upgrade Teaser Banner */}
      <div className="px-4 py-2.5">
        <button
          onClick={onOpenLikesYou}
          className="w-full relative overflow-hidden rounded-2xl p-3 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 text-left flex items-center justify-between"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 font-black text-xs tracking-wider uppercase">
              <Sparkles className="w-4 h-4 fill-black" />
              <span>Tinder Gold™</span>
            </div>
            <p className="text-sm font-bold mt-0.5 leading-tight">
              99+ people liked you!
            </p>
            <p className="text-[11px] font-medium opacity-90">
              See who likes you before swiping
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/60 shadow flex items-center justify-center bg-black/10 shrink-0">
            <Sparkles className="w-6 h-6 text-black fill-current animate-pulse" />
          </div>
        </button>
      </div>

      {/* Tabs Switcher: Matches vs Messages */}
      <div className="flex items-center border-b border-gray-100 dark:border-gray-800 px-4 mt-1">
        <button
          onClick={() => setActiveTab('matches')}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition relative flex items-center justify-center gap-1.5 ${
            activeTab === 'matches'
              ? 'border-rose-500 text-rose-500'
              : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <span>Matches</span>
          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full font-semibold">
            {matches.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition relative flex items-center justify-center gap-1.5 ${
            activeTab === 'messages'
              ? 'border-rose-500 text-rose-500'
              : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <span>Messages</span>
          {totalUnread > 0 && (
            <span className="text-xs bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-bold">
              {totalUnread}
            </span>
          )}
        </button>
      </div>

      {/* Matches Horizontal Reel */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800/80">
        <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2.5">
          New Matches
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {/* Gold Likes Card */}
          <div
            onClick={onOpenLikesYou}
            className="flex flex-col items-center gap-1 cursor-pointer group shrink-0"
          >
            <div className="w-14 h-18 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-sm group-hover:scale-105 transition">
              <div className="w-full h-full rounded-[10px] bg-amber-100 dark:bg-amber-950/60 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" />
                <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 mt-1">
                  99+
                </span>
              </div>
            </div>
            <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">Likes</span>
          </div>

          {/* Matches Avatars */}
          {matches.map((m) => (
            <div
              key={m.id}
              onClick={() => onSelectMatch(m.id)}
              className="flex flex-col items-center gap-1 cursor-pointer group shrink-0"
            >
              <div className={`relative w-14 h-18 rounded-xl overflow-hidden p-0.5 transition ${
                activeMatchId === m.id ? 'ring-2 ring-rose-500' : 'ring-1 ring-gray-200 dark:ring-gray-700 group-hover:scale-105'
              }`}>
                <img
                  src={m.profile.photos[0]}
                  alt={m.profile.name}
                  className="w-full h-full object-cover rounded-[10px]"
                />
                {m.unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white dark:border-[#111418]"></span>
                )}
              </div>
              <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300 max-w-[56px] truncate">
                {m.profile.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages / Matches List Section */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {/* Search Bar */}
        <div className="relative px-2 mb-2">
          <Search className="w-4 h-4 text-gray-400 absolute left-5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search matches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-gray-100 dark:bg-gray-800/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500 text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>

        {filteredMatches.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No matches found
          </div>
        ) : (
          <div className="space-y-0.5">
            {filteredMatches.map((m) => {
              const isActive = activeMatchId === m.id
              return (
                <div
                  key={m.id}
                  onClick={() => onSelectMatch(m.id)}
                  className={`relative flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition ${
                    isActive
                      ? 'bg-rose-50/80 dark:bg-rose-950/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
                      <img
                        src={m.profile.photos[0]}
                        alt={m.profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {m.unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-[#111418]"></span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 font-bold text-sm text-gray-900 dark:text-white truncate">
                        <span>{m.profile.name}</span>
                        {m.profile.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20 shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400 shrink-0 ml-1">
                        {m.lastMessageTime || m.matchedAt}
                      </span>
                    </div>

                    <p className={`text-xs truncate mt-0.5 ${
                      m.unreadCount > 0
                        ? 'font-bold text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {m.lastMessage || 'Say hi to your new match!'}
                    </p>
                  </div>

                  {/* Context menu for unmatching */}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === m.id ? null : m.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {menuOpenId === m.id && (
                      <div className="absolute right-0 top-6 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-1 z-30">
                        <button
                          onClick={() => {
                            onUnmatch(m.id)
                            setMenuOpenId(null)
                          }}
                          className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Unmatch
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </aside>
  )
}
