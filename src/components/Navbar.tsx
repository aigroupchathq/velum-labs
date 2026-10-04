import React from 'react'
import { Flame, Volume2, VolumeX, Moon, Sun, Sparkles, User, Compass, MessageCircle } from 'lucide-react'
import type { ActiveTab } from '../types'

interface NavbarProps {
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void
  soundEnabled: boolean
  toggleSound: () => void
  darkMode: boolean
  toggleDarkMode: () => void
  onOpenProfile: () => void
  unreadMessagesCount: number
  likesCount: number
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  toggleSound,
  darkMode,
  toggleDarkMode,
  onOpenProfile,
  unreadMessagesCount,
  likesCount,
}) => {
  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-[#111418] border-b border-gray-200 dark:border-gray-800 z-30 shrink-0">
        <button
          onClick={onOpenProfile}
          className="relative p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          title="My Profile"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-rose-500 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80"
              alt="My Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </button>

        <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab('recs')}>
          <div className="w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 40 40" className="w-8 h-8 drop-shadow">
              <defs>
                <linearGradient id="navFlameMob" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#fd267a" />
                  <stop offset="100%" stop-color="#ff6036" />
                </linearGradient>
              </defs>
              <path fill="url(#navFlameMob)" d="M21.2 3.6C21.2 3.6 21 6.5 20.3 8.3C19.7 10.1 18.5 12.3 16.8 13.9C15.1 15.5 12.8 16.8 12.8 19.3C12.8 24.3 16.9 28.4 21.9 28.4C26.9 28.4 31 24.3 31 19.3C31 13.8 27.2 8.7 21.2 3.6ZM21.9 25.5C19.6 25.5 17.7 23.6 17.7 21.3C17.7 19.8 18.6 18.2 19.7 17.1C20.4 16.3 21.3 15.7 21.9 14.8C22.6 16.1 23.4 17.6 23.4 19.4C23.4 19.6 23.4 19.9 23.3 20.1C23.9 20.1 24.5 20.3 25 20.7C25.7 21.3 26.1 22.2 26.1 23.2C26.1 24.5 24.2 25.5 21.9 25.5Z"/>
            </svg>
          </div>
          <span className="text-2xl font-black tracking-tight text-brand-gradient">
            tinder
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleSound}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full transition"
            title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-rose-500" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-full transition"
            title="Toggle Dark/Light Mode"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-[#111418] border-t border-gray-200 dark:border-gray-800 flex items-center justify-around z-30 px-2 shadow-lg">
        <button
          onClick={() => setActiveTab('recs')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition ${
            activeTab === 'recs'
              ? 'text-rose-500 scale-105'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          }`}
        >
          <Flame className="w-6 h-6 fill-current" />
          <span className="text-[10px] font-semibold mt-0.5">Discover</span>
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition ${
            activeTab === 'explore'
              ? 'text-rose-500 scale-105'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          }`}
        >
          <Compass className="w-6 h-6" />
          <span className="text-[10px] font-semibold mt-0.5">Explore</span>
        </button>

        <button
          onClick={() => setActiveTab('likes')}
          className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition ${
            activeTab === 'likes'
              ? 'text-amber-500 scale-105'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          }`}
        >
          <Sparkles className="w-6 h-6 fill-amber-500/20" />
          <span className="text-[10px] font-semibold mt-0.5">Likes</span>
          {likesCount > 0 && (
            <span className="absolute top-1 right-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
              {likesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('likes')}
          className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition ${
            activeTab === 'likes' && unreadMessagesCount > 0
              ? 'text-rose-500'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          }`}
        >
          <MessageCircle className="w-6 h-6" />
          <span className="text-[10px] font-semibold mt-0.5">Chat</span>
          {unreadMessagesCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#111418]"></span>
          )}
        </button>

        <button
          onClick={onOpenProfile}
          className="flex flex-col items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-semibold mt-0.5">Profile</span>
        </button>
      </nav>
    </>
  )
}
