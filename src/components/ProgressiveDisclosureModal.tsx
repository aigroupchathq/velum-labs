// Universal Compatibility Platform: 6-Stage Progressive Disclosure Profile Manager
// Governing Standard: Master Build Specification §30

import React, { useState } from 'react'
import {
  Layers,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  User,
  Heart,
  Sliders,
  ShieldAlert,
  Percent,
  Sparkles,
  Save,
} from 'lucide-react'
import type { UniversalUserProfile } from '../types'

interface ProgressiveDisclosureProps {
  currentUser: UniversalUserProfile
  onUpdateUser: (updatedUser: UniversalUserProfile) => void
}

export const ProgressiveDisclosureModal: React.FC<ProgressiveDisclosureProps> = ({
  currentUser,
  onUpdateUser,
}) => {
  const [currentStage, setCurrentStage] = useState<number>(1)
  const [userState, setUserState] = useState<UniversalUserProfile>(currentUser)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleSave = () => {
    onUpdateUser(userState)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2500)
  }

  const stages = [
    { number: 1, title: 'Identity', desc: 'Who are you?', icon: User },
    { number: 2, title: 'Intention', desc: 'What are you looking for?', icon: Heart },
    { number: 3, title: 'Preferences', desc: 'What matters most?', icon: Sliders },
    { number: 4, title: 'Dealbreakers', desc: 'Non-negotiable boundaries', icon: ShieldAlert },
    { number: 5, title: 'Flexibility', desc: 'Controlled compromise', icon: Percent },
    { number: 6, title: 'Deep Profile', desc: 'Optional resonance profile', icon: Sparkles },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Progressive Disclosure Architecture (Spec §30)</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">Multi-Stage Profile Architect</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Configure your profile without bureaucratic survey fatigue. Information is voluntary, granular, and strictly decoupled from popularity algorithms.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saveSuccess ? 'Saved ✓' : 'Save Changes'}</span>
          </button>
        </div>

        {/* 6 Stage Stepper Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-6">
          {stages.map((st) => {
            const Icon = st.icon
            const isActive = currentStage === st.number
            const isCompleted = currentStage > st.number

            return (
              <button
                key={st.number}
                onClick={() => setCurrentStage(st.number)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : isCompleted
                    ? 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    : 'bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1">
                    <Icon className="w-3 h-3 text-indigo-400" />
                    <span className="text-[10px] font-bold text-slate-400">STAGE {st.number}</span>
                  </div>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="text-xs font-bold truncate">{st.title}</div>
                <div className="text-[10px] text-slate-400 truncate">{st.desc}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active Stage Form Container */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        {/* STAGE 1: IDENTITY */}
        {currentStage === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Stage 1: Who are you? (Identity &amp; Self)</h2>
            <p className="text-xs text-slate-400">
              Self-declared intrinsic attributes. These describe who you are and are never inferred by computer vision or AI.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Display Name</label>
                <input
                  type="text"
                  value={userState.identity.name}
                  onChange={(e) =>
                    setUserState({
                      ...userState,
                      identity: { ...userState.identity, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Pronouns</label>
                <input
                  type="text"
                  value={userState.identity.pronouns}
                  onChange={(e) =>
                    setUserState({
                      ...userState,
                      identity: { ...userState.identity, pronouns: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Public Bio</label>
              <textarea
                rows={3}
                value={userState.identity.bio}
                onChange={(e) =>
                  setUserState({
                    ...userState,
                    identity: { ...userState.identity, bio: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold text-white block mb-2">Dietary Identity (Spec §5: "I am")</span>
              <div className="flex flex-wrap gap-2">
                {(['vegetarian', 'vegan', 'omnivore', 'pescatarian', 'other'] as const).map((diet) => (
                  <button
                    key={diet}
                    type="button"
                    onClick={() =>
                      setUserState({
                        ...userState,
                        lifestyle: { ...userState.lifestyle, diet },
                      })
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${
                      userState.lifestyle.diet === diet
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: INTENTION */}
        {currentStage === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Stage 2: What are you looking for? (Intention &amp; Structure)</h2>
            <p className="text-xs text-slate-400">
              Define the structural architecture of relationship you wish to build.
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Primary Relationship Horizon</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Long-Term Partnership / Marriage',
                  'Long-Term Exploratory',
                  'Short-Term Dating',
                  'Casual Companionship',
                  'Intentional Discovery',
                ].map((intent) => (
                  <button
                    key={intent}
                    type="button"
                    onClick={() =>
                      setUserState({
                        ...userState,
                        intention: { ...userState.intention, primaryIntent: intent },
                      })
                    }
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      userState.intention.primaryIntent === intent
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {intent}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Relationship Structure</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['monogamous', 'polyamorous', 'enm', 'flexible'] as const).map((struct) => (
                  <button
                    key={struct}
                    type="button"
                    onClick={() =>
                      setUserState({
                        ...userState,
                        intention: { ...userState.intention, relationshipStructure: struct },
                      })
                    }
                    className={`p-2.5 rounded-xl border text-center text-xs font-medium capitalize transition-all ${
                      userState.intention.relationshipStructure === struct
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {struct}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: PREFERENCES */}
        {currentStage === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Stage 3: What matters? (Weighted Preferences)</h2>
            <p className="text-xs text-slate-400">
              Establish what traits carry weight in partner compatibility.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">Importance of Core Values Alignment</span>
                  <span className="text-indigo-400 font-bold">{userState.preferences.valuesWeight} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={userState.preferences.valuesWeight}
                  onChange={(e) =>
                    setUserState({
                      ...userState,
                      preferences: { ...userState.preferences, valuesWeight: parseInt(e.target.value) },
                    })
                  }
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">Importance of Conflict Resolution Pacing</span>
                  <span className="text-indigo-400 font-bold">{userState.preferences.communicationWeight} / 5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={userState.preferences.communicationWeight}
                  onChange={(e) =>
                    setUserState({
                      ...userState,
                      preferences: { ...userState.preferences, communicationWeight: parseInt(e.target.value) },
                    })
                  }
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STAGE 4: DEALBREAKERS */}
        {currentStage === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Stage 4: What are your dealbreakers? (Hard Gating)</h2>
            <p className="text-xs text-slate-400">
              Non-negotiable boundaries. If a candidate violates any dealbreaker, their mutual score is zero and they are discarded.
            </p>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userState.preferences.smokingPreference.dealbreaker}
                  onChange={(e) =>
                    setUserState({
                      ...userState,
                      preferences: {
                        ...userState.preferences,
                        smokingPreference: {
                          ...userState.preferences.smokingPreference,
                          dealbreaker: e.target.checked,
                          requirementLevel: e.target.checked ? 'MUST' : 'PREFERENCE',
                        },
                      },
                    })
                  }
                  className="w-4 h-4 accent-indigo-500 rounded"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Strict Non-Smoker Policy (`MUST`)</span>
                  <span className="text-[11px] text-slate-400">
                    Immediately exclude anyone who smokes or vapes socially or regularly.
                  </span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userState.preferences.structurePreference.dealbreaker}
                  onChange={(e) =>
                    setUserState({
                      ...userState,
                      preferences: {
                        ...userState.preferences,
                        structurePreference: {
                          ...userState.preferences.structurePreference,
                          dealbreaker: e.target.checked,
                          requirementLevel: e.target.checked ? 'MUST' : 'PREFERENCE',
                        },
                      },
                    })
                  }
                  className="w-4 h-4 accent-indigo-500 rounded"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Strict Relationship Structure (`MUST`)</span>
                  <span className="text-[11px] text-slate-400">
                    Exclude candidates with differing relationship frameworks (e.g. polyamory vs monogamy).
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* STAGE 5: FLEXIBILITY */}
        {currentStage === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Stage 5: What are you flexible about? (Controlled Relaxation)</h2>
            <p className="text-xs text-slate-400">
              Configure smooth partial-credit decay instead of binary rejection.
            </p>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">
                    Dietary Partner Flexibility (Spec §5: "I am willing to compromise")
                  </span>
                  <span className="text-indigo-400 font-bold">
                    {userState.preferences.dietPreference.flexibility}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={userState.preferences.dietPreference.flexibility}
                  onChange={(e) =>
                    setUserState({
                      ...userState,
                      preferences: {
                        ...userState.preferences,
                        dietPreference: {
                          ...userState.preferences.dietPreference,
                          flexibility: parseInt(e.target.value),
                        },
                      },
                    })
                  }
                  className="w-full accent-indigo-500"
                />
                <span className="text-[10px] text-slate-500 block mt-1">
                  At 70% flexibility, omnivore partners receive partial credit without disqualification.
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">Age Boundary Margin (± Years)</span>
                  <span className="text-indigo-400 font-bold">
                    ±{userState.preferences.ageFlexibilityYears} yrs
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={userState.preferences.ageFlexibilityYears}
                  onChange={(e) =>
                    setUserState({
                      ...userState,
                      preferences: {
                        ...userState.preferences,
                        ageFlexibilityYears: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STAGE 6: DEEP PROFILE */}
        {currentStage === 6 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Stage 6: Optional Deeper Compatibility Profile</h2>
            <p className="text-xs text-slate-400">
              Optional psychological and circadian resonance details. Unfilled fields increase uncertainty without penalizing scores.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <label className="block text-xs font-bold text-white mb-2">Sleep Chronotype</label>
                <div className="space-y-2">
                  {(['morning_lark', 'intermediate', 'night_owl'] as const).map((chrono) => (
                    <button
                      key={chrono}
                      type="button"
                      onClick={() =>
                        setUserState({
                          ...userState,
                          accessibility: { ...userState.accessibility, sleepChronotype: chrono },
                        })
                      }
                      className={`w-full p-2 rounded-lg border text-left text-xs capitalize transition-all ${
                        userState.accessibility.sleepChronotype === chrono
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {chrono.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <label className="block text-xs font-bold text-white mb-2">Conflict Resolution Style</label>
                <div className="space-y-2">
                  {(['reflective_deliberate', 'direct_immediate', 'space_first', 'diplomatic'] as const).map(
                    (style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() =>
                          setUserState({
                            ...userState,
                            communication: { ...userState.communication, conflictStyle: style },
                          })
                        }
                        className={`w-full p-2 rounded-lg border text-left text-xs capitalize transition-all ${
                          userState.communication.conflictStyle === style
                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {style.replace('_', ' ')}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stepper Controls Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            disabled={currentStage === 1}
            onClick={() => setCurrentStage(currentStage - 1)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:text-slate-400 flex items-center space-x-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Stage</span>
          </button>

          <span className="text-xs text-slate-500">
            Stage {currentStage} of 6
          </span>

          <button
            disabled={currentStage === 6}
            onClick={() => setCurrentStage(currentStage + 1)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-40 flex items-center space-x-1.5"
          >
            <span>Next Stage</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
