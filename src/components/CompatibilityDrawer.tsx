import React from 'react'
import type { CompatibilityReport } from '../types'
import {
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  Scale,
  Sparkles,
  ArrowRightLeft,
  XCircle,
  ChevronDown,
} from 'lucide-react'

interface CompatibilityDrawerProps {
  report: CompatibilityReport
  onClose?: () => void
  isInline?: boolean
}

export const CompatibilityDrawer: React.FC<CompatibilityDrawerProps> = ({
  report,
  onClose,
  isInline = false,
}) => {
  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border text-left transition ${
        isInline
          ? 'bg-gray-50/90 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700/80 shadow-sm'
          : 'bg-white dark:bg-[#111418] border-gray-200 dark:border-gray-800 shadow-xl'
      }`}
    >
      {/* Header Summary */}
      <div className="flex items-center justify-between border-b border-gray-200/80 dark:border-gray-700/80 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
              <span>Match Intelligence Engine</span>
              {report.isExcluded ? (
                <span className="text-[10px] bg-red-500 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                  Excluded
                </span>
              ) : (
                <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                  Compatible
                </span>
              )}
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Evaluated with Hard Requirements, Mutuality, and Controlled Flexibility
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Dual Metric Cards: Mutual Compatibility vs Confidence */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Metric 1: Compatibility (Mutual) */}
        <div className="p-3 rounded-xl bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-gray-700/60 shadow-xs">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide flex items-center justify-between">
            <span>Compatibility</span>
            <ArrowRightLeft className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-2xl font-black ${
              report.isExcluded
                ? 'text-red-500'
                : report.mutualScore >= 80
                ? 'text-emerald-500'
                : 'text-amber-500'
            }`}>
              {report.mutualScore}%
            </span>
            <span className="text-[10px] text-gray-400">Mutual</span>
          </div>

          <div className="mt-1.5 text-[10px] text-gray-500 dark:text-gray-400 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-1">
            <span>You → Them: <b>{report.scoreAtoB}%</b></span>
            <span>Them → You: <b>{report.scoreBtoA}%</b></span>
          </div>
        </div>

        {/* Metric 2: Confidence (Separated from Compatibility) */}
        <div className="p-3 rounded-xl bg-white dark:bg-[#1a1f26] border border-gray-200 dark:border-gray-700/60 shadow-xs">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide flex items-center justify-between">
            <span>Confidence</span>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-blue-500">
              {report.confidenceScore}%
            </span>
            <span className="text-[10px] text-gray-400">({report.confidenceRating})</span>
          </div>

          <div className="mt-1.5 text-[10px] text-gray-500 dark:text-gray-400 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-1">
            <span>Evidence: <b>{report.knownCriteriaCount} known</b></span>
            <span>{report.unknownAttributes.length} unknown</span>
          </div>
        </div>
      </div>

      {/* Conflicts Banner (Explicitly Identified) */}
      {report.conflicts.length > 0 && (
        <div className="mb-4 space-y-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Identified Conflicts ({report.conflicts.length})</span>
          </div>
          {report.conflicts.map((conflict) => (
            <div
              key={conflict.id}
              className={`p-2.5 rounded-xl text-xs flex items-start gap-2 border ${
                conflict.severity === 'dealbreaker'
                  ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300'
                  : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300'
              }`}
            >
              {conflict.severity === 'dealbreaker' ? (
                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-bold flex items-center gap-1.5">
                  <span className="capitalize">{conflict.field}</span>
                  <span className="text-[9px] uppercase px-1.5 py-0.2 rounded font-extrabold bg-black/10 dark:bg-white/10">
                    {conflict.severity.replace('_', ' ')}
                  </span>
                </div>
                <p className="mt-0.5 leading-snug">{conflict.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rules Breakdown Tabs / Sections */}
      <div className="space-y-3">
        {/* 1. Hard Requirements */}
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 flex items-center justify-between mb-1.5">
            <span>Hard Requirements</span>
            <span className="text-[9px] font-semibold text-rose-500">Exclusion on breach</span>
          </div>
          <div className="space-y-1">
            {report.hardRequirements.map((c) => (
              <div
                key={c.field}
                className="flex items-center justify-between p-2 rounded-lg bg-white/70 dark:bg-[#1a1f26]/70 border border-gray-100 dark:border-gray-800 text-xs"
              >
                <div className="flex items-center gap-2">
                  {c.isExcluded ? (
                    <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  ) : c.relaxed ? (
                    <Scale className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  )}
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {c.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {c.relaxed && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                      Flex Relaxed
                    </span>
                  )}
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[160px] sm:max-w-[220px]">
                    {c.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Strong Preferences */}
        {report.strongPreferences.length > 0 && (
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 flex items-center justify-between mb-1.5">
              <span>Strong Preferences</span>
              <span className="text-[9px] font-semibold text-purple-500">Weight 3.0×</span>
            </div>
            <div className="space-y-1">
              {report.strongPreferences.map((c) => (
                <div
                  key={c.field}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/70 dark:bg-[#1a1f26]/70 border border-gray-100 dark:border-gray-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {c.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[180px] sm:max-w-[240px]">
                    {c.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Normal Preferences */}
        {report.normalPreferences.length > 0 && (
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 flex items-center justify-between mb-1.5">
              <span>Normal Preferences</span>
              <span className="text-[9px] font-semibold text-blue-500">Weight 1.0×</span>
            </div>
            <div className="space-y-1">
              {report.normalPreferences.map((c) => (
                <div
                  key={c.field}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/70 dark:bg-[#1a1f26]/70 border border-gray-100 dark:border-gray-800 text-xs"
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {c.label}
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[180px] sm:max-w-[240px]">
                    {c.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Unknown Attributes (Neutral - Not Treated As Incompatible) */}
        {report.unknownAttributes.length > 0 && (
          <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-400 mb-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Unknown Attributes ({report.unknownAttributes.length})</span>
            </div>
            <p className="text-[11px] text-blue-600/90 dark:text-blue-300/80 leading-relaxed">
              <b>No penalty applied:</b> {report.unknownAttributes.join(', ')} are unlisted. Following our policy, unknown fields are excluded from incompatibility and reflected strictly in confidence ({report.confidenceScore}%).
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
