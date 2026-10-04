import React, { useState } from 'react'
import type { UserProfile, UserPreferences } from '../types'
import { X, Camera, Sparkles } from 'lucide-react'

interface UserProfileModalProps {
  userProfile: UserProfile
  onUpdateProfile: (updated: UserProfile) => void
  preferences: UserPreferences
  onUpdatePreferences: (updated: UserPreferences) => void
  onClose: () => void
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  userProfile,
  onUpdateProfile,
  preferences,
  onUpdatePreferences,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile')
  const [profileData, setProfileData] = useState<UserProfile>(userProfile)
  const [prefsData, setPrefsData] = useState<UserPreferences>(preferences)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    onUpdateProfile(profileData)
    onUpdatePreferences(prefsData)
    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
      onClose()
    }, 400)
  }

  const allPassions = [
    'Photography',
    'Coffee',
    'Architecture',
    'Bouldering',
    'Music',
    'Pottery',
    'Travel',
    'Sushi',
    'Dogs',
    'Yoga',
    'Indie Rock',
    'Baking',
  ]

  const togglePassion = (passion: string) => {
    if (profileData.passions.includes(passion)) {
      setProfileData({
        ...profileData,
        passions: profileData.passions.filter((p) => p !== passion),
      })
    } else {
      if (profileData.passions.length < 5) {
        setProfileData({
          ...profileData,
          passions: [...profileData.passions, passion],
        })
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#111418] md:rounded-3xl shadow-2xl overflow-hidden min-h-screen md:min-h-0 md:max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`text-sm font-extrabold pb-1 border-b-2 transition ${
                activeTab === 'profile'
                  ? 'border-rose-500 text-rose-500'
                  : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`text-sm font-extrabold pb-1 border-b-2 transition ${
                activeTab === 'settings'
                  ? 'border-rose-500 text-rose-500'
                  : 'border-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Discovery Settings
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-full bg-brand-gradient text-white text-xs font-bold shadow hover:opacity-95 transition"
            >
              {isSaved ? 'Saved!' : 'Done'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'profile' ? (
            <>
              {/* Photo Upload Area */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Profile Photos
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-dashed border-rose-400/50 bg-gray-100 dark:bg-gray-800/80 group">
                    <img
                      src={profileData.photos[0]}
                      alt="Primary Avatar"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                      <Camera className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 hover:border-rose-500 hover:text-rose-500 cursor-pointer transition">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[11px] font-bold">+ Add Photo</span>
                  </div>

                  <div className="aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 hover:border-rose-500 hover:text-rose-500 cursor-pointer transition">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[11px] font-bold">+ Add Photo</span>
                  </div>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={profileData.age}
                    onChange={(e) => setProfileData({ ...profileData, age: parseInt(e.target.value) || 18 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                  About Me (Bio)
                </label>
                <textarea
                  rows={3}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Write something cool about yourself..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* Job & School */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={profileData.occupation}
                    onChange={(e) => setProfileData({ ...profileData, occupation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
                    School / University
                  </label>
                  <input
                    type="text"
                    value={profileData.school}
                    onChange={(e) => setProfileData({ ...profileData, school: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Passions Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Passions (Select up to 5)
                </label>
                <div className="flex flex-wrap gap-2">
                  {allPassions.map((passion) => {
                    const isSelected = profileData.passions.includes(passion)
                    return (
                      <button
                        key={passion}
                        type="button"
                        onClick={() => togglePassion(passion)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition active:scale-95 ${
                          isSelected
                            ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {passion} {isSelected ? '✓' : '+'}
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Discovery Preferences */}
              <div className="space-y-6">
                {/* Distance Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      Maximum Distance
                    </span>
                    <span className="text-sm font-bold text-rose-500">
                      {prefsData.maxDistance} mi
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={prefsData.maxDistance}
                    onChange={(e) =>
                      setPrefsData({ ...prefsData, maxDistance: parseInt(e.target.value) })
                    }
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>

                {/* Age Range Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      Age Range
                    </span>
                    <span className="text-sm font-bold text-rose-500">
                      {prefsData.minAge} - {prefsData.maxAge}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min="18"
                      max="50"
                      value={prefsData.minAge}
                      onChange={(e) =>
                        setPrefsData({
                          ...prefsData,
                          minAge: Math.min(parseInt(e.target.value), prefsData.maxAge - 1),
                        })
                      }
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                    <input
                      type="range"
                      min="18"
                      max="60"
                      value={prefsData.maxAge}
                      onChange={(e) =>
                        setPrefsData({
                          ...prefsData,
                          maxAge: Math.max(parseInt(e.target.value), prefsData.minAge + 1),
                        })
                      }
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Show Me */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    Show Me
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['women', 'men', 'everyone'] as const).map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => setPrefsData({ ...prefsData, showMe: gender })}
                        className={`py-2 px-3 rounded-xl text-xs font-bold capitalize border transition ${
                          prefsData.showMe === gender
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-500 border-rose-500'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent'
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Incognito / Privacy Toggle */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                      Incognito Mode
                    </h4>
                    <p className="text-xs text-gray-400">
                      Only be shown to people you've swiped right on
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={prefsData.incognito}
                    onChange={(e) => setPrefsData({ ...prefsData, incognito: e.target.checked })}
                    className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                  />
                </div>

                {/* App Feature Perks (Tinder Gold/Platinum) */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow">
                  <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wide">
                    <Sparkles className="w-4 h-4 fill-black" />
                    <span>Tinder Gold Member Perks Active</span>
                  </div>
                  <ul className="text-xs font-medium space-y-1 mt-2 opacity-95">
                    <li>✓ Unlimited Likes & Swipes</li>
                    <li>✓ Unlimited Rewinds (undo previous swipe)</li>
                    <li>✓ 5 Free Super Likes every week</li>
                    <li>✓ 1 Free Profile Boost every month</li>
                    <li>✓ See who likes you before swiping</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
