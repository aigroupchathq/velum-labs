// ============================================================================
// src/components/account/AccountValuesLifestyleView.tsx
// Subview 10: Values & Lifestyle (Ecology, Conflict, Traps & Blend Preview)
// ============================================================================

import React from 'react'
import { ArrowLeft, Check, Sun, Moon, CheckCircle2 } from 'lucide-react'
import type { UniversalUserProfile } from '../../types'

interface AccountValuesLifestyleViewProps {
  profile: UniversalUserProfile
  reassuranceCadence: string
  conflictStyle: string
  rechargeStyle: string
  acknowledgedPatterns: string[]
  blendCandidate: UniversalUserProfile
  blendEvaluation: any
  candidates: UniversalUserProfile[]
  onSelectBlendCandidate: (id: string) => void
  onChangeProfile: (updated: UniversalUserProfile) => void
  onChangeReassuranceCadence: (cad: string) => void
  onChangeConflictStyle: (style: string) => void
  onChangeRechargeStyle: (style: string) => void
  onTogglePattern: (trapId: string) => void
  onSave: () => void
  onBack: () => void
}

export const AccountValuesLifestyleView: React.FC<AccountValuesLifestyleViewProps> = ({
  profile,
  reassuranceCadence,
  conflictStyle,
  rechargeStyle,
  acknowledgedPatterns,
  blendCandidate,
  blendEvaluation,
  candidates,
  onSelectBlendCandidate,
  onChangeProfile,
  onChangeReassuranceCadence,
  onChangeConflictStyle,
  onChangeRechargeStyle,
  onTogglePattern,
  onSave,
  onBack,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between pt-2 pb-1">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-neutral-300 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Values & Lifestyle</h1>
            <p className="text-xs text-neutral-400 font-light">Daily life, habits and compatibility</p>
          </div>
        </div>

        <button
          onClick={onSave}
          className="px-4 py-1.5 rounded-full bg-[#F472B6] hover:bg-pink-400 text-black text-xs font-semibold transition cursor-pointer shadow-md"
        >
          Save
        </button>
      </div>

      <div className="bg-[#17161A] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl">
        {/* Core Values Compass */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Core Life Compass (Select at least 3)
            </h3>
            <span className="text-[11px] text-[#F472B6] font-mono">
              {profile.values.coreValues.length} Active
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              'Autonomy & Growth',
              'Ethical Integrity',
              'Creative Expression',
              'Radical Candor',
              'Curiosity & Wonder',
              'Emotional Depth',
              'Compassion',
              'Intentional Living',
            ].map((val) => {
              const isSelected = profile.values.coreValues.includes(val)
              return (
                <button
                  key={val}
                  onClick={() => {
                    const updated = isSelected
                      ? profile.values.coreValues.filter((v) => v !== val)
                      : [...profile.values.coreValues, val]
                    onChangeProfile({
                      ...profile,
                      values: { ...profile.values, coreValues: updated },
                    })
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-[#F472B6] text-black font-semibold shadow-md'
                      : 'bg-neutral-950 text-neutral-400 hover:text-white border border-white/[0.08]'
                  }`}
                >
                  <span>{val}</span>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Daily Ecology: Sleep Chronotype & Cleanliness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Sleep */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-white/[0.08] space-y-2">
            <span className="text-[11px] font-mono text-neutral-400 block">Sleep Chronotype</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  onChangeProfile({
                    ...profile,
                    accessibility: { ...profile.accessibility, sleepChronotype: 'morning_lark' },
                  })
                }
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center space-x-1.5 cursor-pointer ${
                  profile.accessibility.sleepChronotype === 'morning_lark'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Morning Lark</span>
              </button>

              <button
                onClick={() =>
                  onChangeProfile({
                    ...profile,
                    accessibility: { ...profile.accessibility, sleepChronotype: 'night_owl' },
                  })
                }
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center space-x-1.5 cursor-pointer ${
                  profile.accessibility.sleepChronotype === 'night_owl'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Night Owl</span>
              </button>
            </div>
          </div>

          {/* Cleanliness */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-white/[0.08] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-400 font-mono text-[11px]">Cleanliness Standard</span>
              <span className="text-white font-mono font-bold">
                {profile.lifestyle.cleanlinessStandard}/5
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={profile.lifestyle.cleanlinessStandard}
              onChange={(e) =>
                onChangeProfile({
                  ...profile,
                  lifestyle: {
                    ...profile.lifestyle,
                    cleanlinessStandard: Number(e.target.value) as 1 | 2 | 3 | 4 | 5,
                  },
                })
              }
              className="w-full accent-cyan cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>Relaxed</span>
              <span>Orderly</span>
              <span>Immaculate</span>
            </div>
          </div>
        </div>

        {/* Reassurance & Cadence */}
        <div className="space-y-2">
          <label className="text-xs text-neutral-400 font-mono block">Reassurance &amp; Texting Cadence</label>
          <div className="space-y-2 text-xs">
            {[
              'Warm daily check-ins (1–2 thoughtful messages)',
              'Thoughtful intermittent (fine with a quiet day)',
              'In-person centered (low texting between dates)',
            ].map((cad) => (
              <div
                key={cad}
                onClick={() => onChangeReassuranceCadence(cad)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  reassuranceCadence === cad
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                    : 'bg-neutral-950 border-white/[0.06] text-neutral-400 hover:text-white'
                }`}
              >
                <span className="font-light">{cad}</span>
                {reassuranceCadence === cad && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Conflict & Repair Protocol */}
        <div className="space-y-2">
          <label className="text-xs text-neutral-400 font-mono block">Conflict &amp; Repair Protocol</label>
          <div className="space-y-2 text-xs">
            {[
              'Needs 20-min cool-down before speaking calmly',
              'Prefers talking it through immediately with care',
              'Drafts thoughts in writing first to avoid reactivity',
            ].map((cStyle) => (
              <div
                key={cStyle}
                onClick={() => onChangeConflictStyle(cStyle)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  conflictStyle === cStyle
                    ? 'bg-purple-950/30 border-purple-500/50 text-purple-200'
                    : 'bg-neutral-950 border-white/[0.06] text-neutral-400 hover:text-white'
                }`}
              >
                <span className="font-light">{cStyle}</span>
                {conflictStyle === cStyle && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Sensory Recharge & Solitude */}
        <div className="space-y-2">
          <label className="text-xs text-neutral-400 font-mono block">Sensory Recharge &amp; Solitude</label>
          <div className="space-y-2 text-xs">
            {[
              'Parallel play (reading/working quietly in the same room)',
              'Solitary sanctuary (needs 1–2 solo evenings weekly)',
              'Social host (recharges by hosting and socializing)',
            ].map((rStyle) => (
              <div
                key={rStyle}
                onClick={() => onChangeRechargeStyle(rStyle)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  rechargeStyle === rStyle
                    ? 'bg-sky-950/30 border-sky-500/50 text-sky-200'
                    : 'bg-neutral-950 border-white/[0.06] text-neutral-400 hover:text-white'
                }`}
              >
                <span className="font-light">{rStyle}</span>
                {rechargeStyle === rStyle && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Dating Traps Being Broken (Need #2, #9) */}
        <div className="space-y-3 pt-2">
          <label className="text-xs text-neutral-400 font-mono block">
            Dating Traps I Am Actively Choosing to Break
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'Confusing emotional adrenaline with genuine long-term fit',
                title: 'Confusing Intensity with Intimacy',
                trap: 'Chasing unpredictable, aloof partners whose inconsistent replies trigger anxiety.',
              },
              {
                id: 'Ignoring mismatched family timelines early on',
                title: 'The "They’ll Change Their Mind" Trap',
                trap: 'Investing months hoping a partner will change mind on marriage, kids, or location.',
              },
              {
                id: 'Compromising boundaries to avoid being alone',
                title: 'Boundary Slippage',
                trap: 'Tolerating dealbreaker habits because they look good on paper or feel charming.',
              },
              {
                id: 'Second-guessing your own intuition after bad dates',
                title: 'Distrusting Your Own Judgment',
                trap: 'Feeling cynical after ghosting, wondering if you can trust yourself.',
              },
            ].map((trap) => {
              const isSelected = acknowledgedPatterns.includes(trap.id)
              return (
                <div
                  key={trap.id}
                  onClick={() => onTogglePattern(trap.id)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                      : 'bg-neutral-950 border-white/[0.06] text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-white">{trap.title}</h4>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] font-light leading-relaxed">{trap.trap}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Live Taste Blend Simulator (Spotify Blend Spec) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-white/[0.08] space-y-4 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#F472B6]">
              Live Taste Blend Preview
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              {blendCandidate.identity.name.split(' ')[0]} • {blendEvaluation?.mutuality.score || 96}% Resonance
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
            {candidates.slice(0, 5).map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectBlendCandidate(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition cursor-pointer shrink-0 ${
                  blendCandidate.id === c.id
                    ? 'bg-[#F472B6] text-black font-semibold'
                    : 'bg-white/[0.04] text-neutral-400 hover:text-white border border-white/[0.08]'
                }`}
              >
                {c.identity.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {blendEvaluation && (
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
              <span className="text-neutral-300">
                Values &amp; Lifestyle Overlap with {blendCandidate.identity.name}
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {blendEvaluation.mutuality.score}% Harmonic
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
