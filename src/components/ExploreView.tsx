import React from 'react'
import { EXPLORE_CATEGORIES } from '../data/mockProfiles'
import {
  Sparkles,
  HeartHandshake,
  Coffee,
  Gamepad2,
  UtensilsCrossed,
  Compass,
  ArrowRight,
  Flame,
} from 'lucide-react'

interface ExploreViewProps {
  onSelectCategory: (categoryTag: string) => void
  activeCategory: string | null
  onClearCategory: () => void
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onSelectCategory,
  activeCategory,
  onClearCategory,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-white" />
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6 text-white" />
      case 'Coffee':
        return <Coffee className="w-6 h-6 text-white" />
      case 'Gamepad2':
        return <Gamepad2 className="w-6 h-6 text-white" />
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-6 h-6 text-white" />
      case 'Compass':
        return <Compass className="w-6 h-6 text-white" />
      default:
        return <Flame className="w-6 h-6 text-white" />
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full">
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 md:p-8 mb-6 bg-brand-gradient text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur">
            New in Tinder
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold mt-2 leading-tight">
            Welcome to Explore
          </h2>
          <p className="text-sm opacity-90 max-w-md mt-1">
            Match by vibes, shared passions, and what you’re looking for tonight.
          </p>
        </div>

        {activeCategory && (
          <button
            onClick={onClearCategory}
            className="px-4 py-2 rounded-full bg-white text-rose-600 font-bold text-xs shadow hover:bg-gray-100 transition shrink-0"
          >
            Clear Active Filter ({activeCategory})
          </button>
        )}
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EXPLORE_CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.tag
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.tag)}
              className={`group relative rounded-3xl overflow-hidden p-6 cursor-pointer shadow-md hover:shadow-xl transition transform hover:-translate-y-1 bg-gradient-to-br ${cat.gradient} text-white flex flex-col justify-between min-h-[170px] ${
                isSelected ? 'ring-4 ring-white shadow-2xl scale-[1.02]' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md">
                  {getIcon(cat.icon)}
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-black/20 backdrop-blur">
                  {cat.count}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold tracking-tight">
                  {cat.title}
                </h3>
                <p className="text-xs opacity-90 mt-0.5">
                  {cat.subtitle}
                </p>
                <div className="flex items-center gap-1 text-xs font-bold mt-3 group-hover:translate-x-1 transition">
                  <span>Join this vibe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
