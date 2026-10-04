import React, { useState, useEffect } from 'react'
import {
  INITIAL_PROFILES,
  INITIAL_MATCHES,
  INITIAL_MESSAGES,
  AUTO_REPLIES,
} from './data/mockProfiles'
import type {
  Profile,
  Match,
  Message,
  SwipeAction,
  UserProfile,
  UserPreferences,
  ActiveTab,
} from './types'
import { sounds } from './utils/sound'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import { CardDeck } from './components/CardDeck'
import { ProfileDetailModal } from './components/ProfileDetailModal'
import { MatchModal } from './components/MatchModal'
import { ChatView } from './components/ChatView'
import { ExploreView } from './components/ExploreView'
import { LikesYouModal } from './components/LikesYouModal'
import { UserProfileModal } from './components/UserProfileModal'
import { SafetyModal } from './components/SafetyModal'

export const App: React.FC = () => {
  // Profiles & Swiping state
  const [profiles] = useState<Profile[]>(INITIAL_PROFILES)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swipeHistory, setSwipeHistory] = useState<
    { action: SwipeAction; profile: Profile; index: number }[]
  >([])

  // Match celebration state
  const [newMatchModalProfile, setNewMatchModalProfile] = useState<Profile | null>(null)

  // Full profile detail modal
  const [selectedDetailProfile, setSelectedDetailProfile] = useState<Profile | null>(null)

  // Matches and Chat state
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES)
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES)
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<ActiveTab>('recs')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showLikesYouModal, setShowLikesYouModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showSafetyModal, setShowSafetyModal] = useState(false)
  const [boostActive, setBoostActive] = useState(false)

  // Sound and Theme settings
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(true)

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alex Rivera',
    age: 25,
    bio: 'Photographer & coffee lover in NYC. Always on the hunt for live music, vintage bookshops, and rooftop views 🌆',
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    ],
    occupation: 'Creative Director',
    school: 'Pratt Institute',
    passions: ['Photography', 'Music', 'Coffee', 'Travel'],
  })

  // User Preferences
  const [preferences, setPreferences] = useState<UserPreferences>({
    maxDistance: 25,
    minAge: 21,
    maxAge: 32,
    showMe: 'everyone',
    soundEnabled: true,
    darkMode: true,
    incognito: false,
  })

  // Initialize Dark Mode & Sounds
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev)
  }

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev
      sounds.setEnabled(next)
      return next
    })
  }

  // Handle Swipe Action
  const handleSwipe = (action: SwipeAction, profile: Profile) => {
    // Record history for rewind
    setSwipeHistory((prev) => [...prev, { action, profile, index: currentIndex }])

    if (action === 'like') {
      sounds.playLike()
      // 50% chance of an exciting instant match
      const shouldMatch = Math.random() > 0.5 || profile.id === 'p1' || profile.id === 'p2'
      if (shouldMatch) {
        triggerMatch(profile)
      }
    } else if (action === 'superlike') {
      sounds.playSuperLike()
      // Super likes always trigger a match!
      triggerMatch(profile)
    } else if (action === 'nope') {
      sounds.playNope()
    }

    setCurrentIndex((prev) => prev + 1)
  }

  // Trigger Match event
  const triggerMatch = (profile: Profile) => {
    sounds.playMatch()
    setNewMatchModalProfile(profile)

    // Add to matches list if not already present
    const existing = matches.find((m) => m.profile.id === profile.id)
    if (!existing) {
      const newMatch: Match = {
        id: `match-${Date.now()}`,
        profile,
        matchedAt: 'Just now',
        unreadCount: 0,
        lastMessage: 'You matched! Say hello 😊',
        lastMessageTime: 'Just now',
      }
      setMatches((prev) => [newMatch, ...prev])
      setMessages((prev) => ({
        ...prev,
        [newMatch.id]: [],
      }))
    }
  }

  // Handle Rewind Action
  const handleRewind = () => {
    if (swipeHistory.length === 0 || currentIndex === 0) return
    sounds.playTap()

    const lastSwipe = swipeHistory[swipeHistory.length - 1]
    setSwipeHistory((prev) => prev.slice(0, prev.length - 1))
    setCurrentIndex(lastSwipe.index)
  }

  // Handle Boost Action
  const handleTriggerBoost = () => {
    sounds.playTap()
    setBoostActive(true)
    setTimeout(() => {
      setBoostActive(false)
    }, 15000)
  }

  // Handle Send Message in Chat
  const handleSendMessage = (
    matchId: string,
    text: string,
    isGif?: boolean,
    mediaUrl?: string
  ) => {
    sounds.playMessage()

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      matchId,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isGif,
      mediaUrl,
    }

    setMessages((prev) => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), newMsg],
    }))

    // Update match's last message
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? {
              ...m,
              lastMessage: isGif ? 'Sent a GIF' : text,
              lastMessageTime: 'Just now',
              unreadCount: 0,
            }
          : m
      )
    )

    // Simulate Match's Auto-Reply
    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        sounds.playMessage()
        const randomReply =
          AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)]
        const replyMsg: Message = {
          id: `msg-reply-${Date.now()}`,
          matchId,
          sender: 'match',
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }

        setMessages((prev) => ({
          ...prev,
          [matchId]: [...(prev[matchId] || []), replyMsg],
        }))

        setMatches((prev) =>
          prev.map((m) =>
            m.id === matchId
              ? {
                  ...m,
                  lastMessage: randomReply,
                  lastMessageTime: 'Just now',
                }
              : m
          )
        )
      }, 2000)
    }, 700)
  }

  // Send message directly from Match modal
  const handleSendFromMatchModal = (profile: Profile, msgText: string) => {
    setNewMatchModalProfile(null)
    const match = matches.find((m) => m.profile.id === profile.id)
    if (match) {
      handleSendMessage(match.id, msgText)
      setActiveMatchId(match.id)
    }
  }

  // Instant match from Tinder Gold Likes You modal
  const handleInstantMatch = (profile: Profile) => {
    triggerMatch(profile)
  }

  // Unmatch handler
  const handleUnmatch = (matchId: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== matchId))
    if (activeMatchId === matchId) {
      setActiveMatchId(null)
    }
  }

  // Filter profiles by explore category
  const filteredProfiles = activeCategory
    ? profiles.filter((p) =>
        p.passions?.some((tag) =>
          tag.toLowerCase().includes(activeCategory.toLowerCase())
        )
      )
    : profiles

  const activeMatch = matches.find((m) => m.id === activeMatchId)
  const totalUnread = matches.reduce((acc, m) => acc + m.unreadCount, 0)

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-gray-100 dark:bg-[#111418] text-gray-900 dark:text-white">
      {/* Mobile Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab)
          setActiveMatchId(null)
        }}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenProfile={() => setShowProfileModal(true)}
        unreadMessagesCount={totalUnread}
        likesCount={99}
      />

      {/* Desktop Left Sidebar */}
      <Sidebar
        userProfile={userProfile}
        matches={matches}
        activeMatchId={activeMatchId}
        onSelectMatch={(id) => {
          setActiveMatchId(id)
          // mark as read
          setMatches((prev) =>
            prev.map((m) => (m.id === id ? { ...m, unreadCount: 0 } : m))
          )
        }}
        onOpenLikesYou={() => setShowLikesYouModal(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenSafety={() => setShowSafetyModal(true)}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onUnmatch={handleUnmatch}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden h-full">
        {/* If Active Chat is Open */}
        {activeMatch ? (
          <ChatView
            match={activeMatch}
            messages={messages[activeMatch.id] || []}
            onSendMessage={handleSendMessage}
            onBack={() => setActiveMatchId(null)}
            onViewProfile={(p) => setSelectedDetailProfile(p)}
            isTyping={isTyping}
          />
        ) : activeTab === 'explore' ? (
          <ExploreView
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat)
              setActiveTab('recs')
            }}
            onClearCategory={() => setActiveCategory(null)}
          />
        ) : (
          /* Main Card Deck View */
          <div className="flex-1 flex flex-col h-full relative">
            {/* Active Category Filter Tag if set */}
            {activeCategory && (
              <div className="px-4 pt-2 flex items-center justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold">
                  <span>Filtered by: {activeCategory}</span>
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="hover:text-rose-700 dark:hover:text-rose-300 font-extrabold"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            <CardDeck
              profiles={filteredProfiles}
              currentIndex={currentIndex}
              onSwipe={handleSwipe}
              onRewind={handleRewind}
              canRewind={swipeHistory.length > 0 && currentIndex > 0}
              onOpenProfileDetail={(p) => setSelectedDetailProfile(p)}
              onTriggerBoost={handleTriggerBoost}
              boostActive={boostActive}
              onRestartDeck={() => {
                setCurrentIndex(0)
                setSwipeHistory([])
              }}
            />
          </div>
        )}
      </main>

      {/* Profile Detail Slide-up Modal */}
      {selectedDetailProfile && (
        <ProfileDetailModal
          profile={selectedDetailProfile}
          onClose={() => setSelectedDetailProfile(null)}
          onSwipe={(action, profile) => {
            handleSwipe(action, profile)
            setSelectedDetailProfile(null)
          }}
        />
      )}

      {/* Match Celebration Modal ("IT'S A MATCH!") */}
      {newMatchModalProfile && (
        <MatchModal
          matchProfile={newMatchModalProfile}
          userProfile={userProfile}
          onClose={() => setNewMatchModalProfile(null)}
          onSendMessage={handleSendFromMatchModal}
        />
      )}

      {/* Tinder Gold "Likes You" Modal */}
      {showLikesYouModal && (
        <LikesYouModal
          onClose={() => setShowLikesYouModal(false)}
          onInstantMatch={handleInstantMatch}
        />
      )}

      {/* User Profile & Discovery Settings Modal */}
      {showProfileModal && (
        <UserProfileModal
          userProfile={userProfile}
          onUpdateProfile={(updated) => setUserProfile(updated)}
          preferences={preferences}
          onUpdatePreferences={(updated) => setPreferences(updated)}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* Safety Center Modal */}
      {showSafetyModal && (
        <SafetyModal onClose={() => setShowSafetyModal(false)} />
      )}
    </div>
  )
}
export default App
