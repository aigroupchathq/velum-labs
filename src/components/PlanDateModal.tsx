// ============================================================================
// src/components/PlanDateModal.tsx
// Universal Compatibility Platform: Plan a Date 3-Step Interactive Flow (Mockup 3A)
// Type -> Details -> Confirm Flow
// ============================================================================

import React, { useState } from 'react'
import {
  X,
  Coffee,
  Footprints,
  Palette,
  Utensils,
  Calendar,
  Clock,
  MapPin,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { sounds } from '../utils/sound'

interface PlanDateModalProps {
  isOpen: boolean
  onClose: () => void
  partnerName?: string
  partnerPhoto?: string
  onPlanCreated?: (plan: {
    type: string
    date: string
    time: string
    area: string
    venueName: string
  }) => void
}

export const PlanDateModal: React.FC<PlanDateModalProps> = ({
  isOpen,
  onClose,
  partnerName = 'Maya',
  partnerPhoto = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  onPlanCreated,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedType, setSelectedType] = useState<string>('coffee')
  const [selectedDate, setSelectedDate] = useState<string>('Sat, 12 Jul 2026')
  const [selectedTime, setSelectedTime] = useState<string>('3:00 PM')
  const [selectedArea, setSelectedArea] = useState<string>('Covent Garden, London')
  const [selectedVenue, setSelectedVenue] = useState<string>('Monmouth Coffee')

  if (!isOpen) return null

  const dateTypes = [
    { id: 'coffee', label: 'Coffee / Casual', icon: Coffee },
    { id: 'walk', label: 'Walk', icon: Footprints },
    { id: 'activity', label: 'Activity', icon: Palette },
    { id: 'dinner', label: 'Dinner', icon: Utensils },
  ]

  const areaOptions = [
    'Covent Garden, London',
    'Bloomsbury, London',
    'South Bank / Thames Path',
    'Shoreditch / Spitalfields',
  ]

  const venueSuggestions: Record<string, string[]> = {
    coffee: ['Monmouth Coffee, Covent Garden', 'WatchHouse, Somerset House', 'Origin Coffee Roasters'],
    walk: ['Regent’s Canal Walk to Camden', 'St. James’s Park Promenade', 'Hampstead Heath Pergola'],
    activity: ['Tate Modern Turbines', 'Courtauld Gallery Ceramics', 'Barbican Conservatory'],
    dinner: ['Dishoom Covent Garden', 'Noble Rot Lamb’s Conduit', 'Rochelle Canteen'],
  }

  const handleNext = () => {
    sounds.playTap()
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else {
      sounds.playLike()
      if (onPlanCreated) {
        onPlanCreated({
          type: selectedType,
          date: selectedDate,
          time: selectedTime,
          area: selectedArea,
          venueName: selectedVenue,
        })
      }
      onClose()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Plan a date with ${partnerName}`}
      className="fixed inset-0 z-50 flex flex-col justify-end lg:justify-center lg:items-center p-0 lg:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="w-full lg:max-w-md rounded-t-[2rem] lg:rounded-3xl bg-[#0F0E11] border border-white/10 shadow-2xl p-5 space-y-5 animate-in slide-in-from-bottom duration-300 max-h-[92vh] overflow-y-auto">
        {/* Grab handle for mobile */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto -mt-1 lg:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2.5">
            <img
              src={partnerPhoto}
              alt={partnerName}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-white/15"
            />
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Plan a date with {partnerName}
              </h3>
              <span className="text-[10px] text-neutral-400">Step {step} of 3</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playTap()
              onClose()
            }}
            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-neutral-300 hover:text-white transition cursor-pointer"
            aria-label="Close date planner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper Pills (Mockup 3A) */}
        <div className="flex items-center justify-between px-2 text-xs">
          <div className={`flex items-center space-x-1.5 ${step >= 1 ? 'text-[#F472B6] font-bold' : 'text-neutral-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#F472B6] text-white' : 'bg-white/10 text-neutral-400'}`}>
              1
            </span>
            <span>Type</span>
          </div>

          <div className="h-[1px] w-8 bg-white/10" />

          <div className={`flex items-center space-x-1.5 ${step >= 2 ? 'text-[#F472B6] font-bold' : 'text-neutral-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#F472B6] text-white' : 'bg-white/10 text-neutral-400'}`}>
              2
            </span>
            <span>Details</span>
          </div>

          <div className="h-[1px] w-8 bg-white/10" />

          <div className={`flex items-center space-x-1.5 ${step === 3 ? 'text-[#F472B6] font-bold' : 'text-neutral-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-[#F472B6] text-white' : 'bg-white/10 text-neutral-400'}`}>
              3
            </span>
            <span>Confirm</span>
          </div>
        </div>

        {/* STEP 1: DATE TYPE */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-semibold text-neutral-300 block">Date type</span>
            <div className="grid grid-cols-2 gap-2.5">
              {dateTypes.map((dt) => {
                const Icon = dt.icon
                const isSelected = selectedType === dt.id
                return (
                  <button
                    key={dt.id}
                    type="button"
                    onClick={() => {
                      sounds.playTap()
                      setSelectedType(dt.id)
                    }}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col items-center justify-center space-y-2 text-center ${
                      isSelected
                        ? 'bg-[#F472B6]/15 border-[#F472B6] text-white shadow-lg shadow-[#F472B6]/20'
                        : 'bg-[#17161A] border-white/[0.08] text-neutral-300 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-[#F472B6]' : 'text-neutral-400'}`} />
                    <span className="text-xs font-medium">{dt.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* STEP 2: WHEN & LOCATION */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* When Section */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-300 block">When?</span>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-2xl bg-[#17161A] border border-white/[0.08] flex items-center space-x-2 text-xs text-white">
                  <Calendar className="w-4 h-4 text-[#F472B6] shrink-0" />
                  <input
                    type="text"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent focus:outline-none text-xs text-white w-full"
                  />
                </div>
                <div className="p-3 rounded-2xl bg-[#17161A] border border-white/[0.08] flex items-center space-x-2 text-xs text-white">
                  <Clock className="w-4 h-4 text-[#F472B6] shrink-0" />
                  <input
                    type="text"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="bg-transparent focus:outline-none text-xs text-white w-full"
                  />
                </div>
              </div>
            </div>

            {/* Location Area Section */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-300 block">Location area</span>
              <div className="space-y-1.5">
                {areaOptions.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => {
                      sounds.playTap()
                      setSelectedArea(area)
                    }}
                    className={`w-full p-3 rounded-2xl text-xs flex items-center justify-between transition cursor-pointer ${
                      selectedArea === area
                        ? 'bg-[#17161A] border border-[#F472B6] text-white'
                        : 'bg-[#17161A] border border-white/[0.06] text-neutral-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-[#F472B6]" />
                      <span>{area}</span>
                    </div>
                    {selectedArea === area ? (
                      <Check className="w-3.5 h-3.5 text-[#F472B6]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRM & VENUE SELECTION */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <span className="text-xs font-semibold text-neutral-300 block">Select Venue Idea</span>
            <div className="space-y-2">
              {(venueSuggestions[selectedType] || venueSuggestions.coffee).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    sounds.playTap()
                    setSelectedVenue(v)
                  }}
                  className={`w-full p-3.5 rounded-2xl text-xs flex items-center justify-between transition cursor-pointer ${
                    selectedVenue === v
                      ? 'bg-[#F472B6]/15 border border-[#F472B6] text-white shadow-md shadow-[#F472B6]/20'
                      : 'bg-[#17161A] border border-white/[0.06] text-neutral-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Coffee className="w-4 h-4 text-[#F472B6]" />
                    <span className="font-medium">{v}</span>
                  </div>
                  {selectedVenue === v && <Check className="w-4 h-4 text-[#F472B6] stroke-[3]" />}
                </button>
              ))}
            </div>

            {/* Plan Summary Card */}
            <div className="p-3.5 rounded-2xl bg-[#17161A] border border-white/10 space-y-1.5 text-xs text-neutral-300">
              <div className="flex items-center justify-between text-white font-semibold">
                <span>{partnerName} &amp; You</span>
                <span className="text-[#F472B6] font-mono">{selectedTime}</span>
              </div>
              <p className="text-[11px] text-neutral-400">{selectedDate} • {selectedArea}</p>
            </div>
          </div>
        )}

        {/* Bottom CTA Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleNext}
            className="w-full min-h-[50px] rounded-2xl bg-[#F472B6] hover:bg-[#f25da8] active:scale-[0.98] text-white font-bold text-sm tracking-tight flex items-center justify-center space-x-2 transition cursor-pointer shadow-lg shadow-[#F472B6]/25"
          >
            {step === 1 && (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Next: Time &amp; Area</span>
              </>
            )}
            {step === 2 && (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Find Ideas</span>
              </>
            )}
            {step === 3 && (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Send Date Proposal to {partnerName}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
