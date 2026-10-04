// Universal Compatibility Platform: Preference Optimization Simulator
// Governing Standard: Master Build Specification §32

import React, { useState } from 'react'
import {
  Sliders,
  AlertCircle,
  RotateCcw,
} from 'lucide-react'
import type { UniversalUserProfile } from '../types'

interface PreferenceOptimizerProps {
  currentUser: UniversalUserProfile
}

export const PreferenceOptimizerView: React.FC<PreferenceOptimizerProps> = ({
  currentUser,
}) => {
  // Simulator adjustments
  const [distanceDelta, setDistanceDelta] = useState<number>(15) // +15 km
  const [ageFlexDelta, setAgeFlexDelta] = useState<number>(2) // +2 yrs
  const [dietFlexDelta, setDietFlexDelta] = useState<number>(25) // +25%

  const baseCandidates = 142 // Realistic active pool in 25 km
  // Simulation math
  const distanceFactor = 1 + (distanceDelta / 25) * 1.8
  const ageFactor = 1 + (ageFlexDelta / 3) * 0.4
  const dietFactor = 1 + (dietFlexDelta / 100) * 0.6

  const projectedCandidates = Math.round(baseCandidates * distanceFactor * ageFactor * dietFactor)
  const expansionPercent = Math.round(((projectedCandidates - baseCandidates) / baseCandidates) * 100)
  const estimatedCompatibilityImpact = (
    -(distanceDelta * 0.08 + ageFlexDelta * 0.4 + dietFlexDelta * 0.02)
  ).toFixed(1)

  const handleReset = () => {
    setDistanceDelta(0)
    setAgeFlexDelta(0)
    setDietFlexDelta(0)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Sliders className="w-4 h-4" />
          <span>Preference Optimization Engine (Spec §32)</span>
        </div>
        <h1 className="text-2xl font-black text-white mt-1">What-If Discovery Simulator</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Simulate how relaxing specific spatial or categorical constraints expands your viable candidate pool without sacrificing core mutual compatibility.
        </p>

        {/* Big Projection Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Current Candidate Pool
            </span>
            <div className="text-3xl font-black text-white mt-1 flex items-baseline space-x-2">
              <span>{baseCandidates.toLocaleString()}</span>
              <span className="text-xs text-slate-500 font-normal">verified active</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Meeting 100% of current constraints</p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/40">
            <span className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider block">
              Projected Candidate Pool
            </span>
            <div className="text-3xl font-black text-indigo-400 mt-1 flex items-baseline space-x-2">
              <span>{projectedCandidates.toLocaleString()}</span>
              <span className="text-xs text-emerald-400 font-bold">+{expansionPercent}%</span>
            </div>
            <p className="text-[11px] text-indigo-300/80 mt-1">With proposed relaxation adjustments</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Est. Compatibility Impact
            </span>
            <div className="text-3xl font-black text-amber-400 mt-1 flex items-baseline space-x-2">
              <span>{estimatedCompatibilityImpact}%</span>
              <span className="text-xs text-slate-500 font-normal">avg shift</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Minimal change to mutual value fit</p>
          </div>
        </div>

        {/* Visual Concentric Pool Geometry Sparkline */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-white block">Search Horizon Topology</span>
            <p className="text-[11px] text-slate-400">
              Concentric geometric expansion from baseline ({baseCandidates}) to projected ({projectedCandidates}) pool.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Outer projected ring */}
              <div
                className="absolute rounded-full border-2 border-dashed border-indigo-500/50 bg-indigo-500/10 transition-all duration-500"
                style={{
                  width: `${Math.min(96, 44 + (projectedCandidates - baseCandidates) * 0.45)}px`,
                  height: `${Math.min(96, 44 + (projectedCandidates - baseCandidates) * 0.45)}px`,
                }}
              />
              {/* Inner baseline ring */}
              <div className="w-11 h-11 rounded-full border-2 border-indigo-400 bg-indigo-600/30 flex items-center justify-center z-10 shadow-lg shadow-indigo-900/30">
                <span className="text-[10px] font-black text-white">{baseCandidates}</span>
              </div>
            </div>
            <div className="text-[11px] space-y-1 text-slate-400">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block" />
                <span>Baseline Core: {baseCandidates}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500/40 border border-indigo-400 inline-block" />
                <span>Simulated: +{projectedCandidates - baseCandidates} reachable</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Adjustment Sliders */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Hypothetical Constraint Adjustments
          </h2>
          <button
            onClick={handleReset}
            className="text-xs text-slate-400 hover:text-white flex items-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Baseline</span>
          </button>
        </div>

        {/* 1. Distance Relaxation */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-slate-200">
              Expand Discovery Radius (+km beyond {currentUser.geography.maxDistanceKm} km)
            </span>
            <span className="text-indigo-400 font-bold">+{distanceDelta} km</span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            step="5"
            value={distanceDelta}
            onChange={(e) => setDistanceDelta(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Current: {currentUser.geography.maxDistanceKm} km</span>
            <span>Simulated: {currentUser.geography.maxDistanceKm + distanceDelta} km</span>
          </div>
        </div>

        {/* 2. Age Flexibility */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-slate-200">
              Expand Age Boundary Margin (± years beyond ±{currentUser.preferences.ageFlexibilityYears} yr)
            </span>
            <span className="text-indigo-400 font-bold">+{ageFlexDelta} yrs</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="1"
            value={ageFlexDelta}
            onChange={(e) => setAgeFlexDelta(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Range: [{currentUser.preferences.minAge}–{currentUser.preferences.maxAge}]</span>
            <span>
              Simulated: [{currentUser.preferences.minAge - ageFlexDelta}–
              {currentUser.preferences.maxAge + ageFlexDelta}]
            </span>
          </div>
        </div>

        {/* 3. Dietary Flexibility */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-semibold text-slate-200">
              Increase Dietary Flexibility (+% tolerance for omnivore partners)
            </span>
            <span className="text-indigo-400 font-bold">+{dietFlexDelta}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="5"
            value={dietFlexDelta}
            onChange={(e) => setDietFlexDelta(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Current: {currentUser.preferences.dietPreference.flexibility}%</span>
            <span>
              Simulated: {Math.min(100, currentUser.preferences.dietPreference.flexibility + dietFlexDelta)}%
            </span>
          </div>
        </div>

        {/* Statutory Disclaimer per Spec §32 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-start space-x-3">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Platform Invariant (Spec §32):</strong> The numbers above are simulated estimates based on regional population density and statistical attribute distributions. They do not represent guarantees of real-world match outcomes or relationship success.
          </p>
        </div>
      </div>
    </div>
  )
}
