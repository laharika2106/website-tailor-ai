import React from 'react';
import { WEBSITE_CATEGORIES } from '../../data/categories';
import { CategoryInfo } from '../../types/plan';
import {
  Briefcase,
  Building2,
  ShoppingBag,
  UtensilsCrossed,
  GraduationCap,
  BookOpen,
  Cpu,
  CalendarDays,
  HeartPulse,
  Compass,
  Sparkles,
  Wand2,
  ArrowRight,
} from 'lucide-react';

interface CategoriesSectionProps {
  onSelectCategory: (category: CategoryInfo) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onSelectCategory }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Briefcase':
        return Briefcase;
      case 'Building2':
        return Building2;
      case 'ShoppingBag':
        return ShoppingBag;
      case 'UtensilsCrossed':
        return UtensilsCrossed;
      case 'GraduationCap':
        return GraduationCap;
      case 'BookOpen':
        return BookOpen;
      case 'Cpu':
        return Cpu;
      case 'CalendarDays':
        return CalendarDays;
      case 'HeartPulse':
        return HeartPulse;
      case 'Compass':
        return Compass;
      case 'Sparkles':
        return Sparkles;
      case 'Wand2':
      default:
        return Wand2;
    }
  };

  return (
    <section id="categories" className="py-20 lg:py-28 border-t border-slate-800/80 bg-[#080C14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Architectural Blueprints
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Website Categories
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Select a domain archetype to seed your plan. Nathan will tailor the information architecture, recommended pages, and feature set.
            </p>
          </div>
          <div className="text-xs text-slate-400">
            Click any archetype to seed your live plan
          </div>
        </div>

        {/* 12 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {WEBSITE_CATEGORIES.map((cat) => {
            const IconComponent = getIcon(cat.iconName);
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className="text-left rounded-2xl bg-[#0E131E] border border-slate-800 hover:border-indigo-500/50 p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/30 group focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <div>
                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    {cat.badge && (
                      <span className="text-[11px] font-semibold text-indigo-300">
                        {cat.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-indigo-200 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 mb-2">
                    {cat.tagline}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                {/* Card footer: Default pages count & Action */}
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{cat.defaultPages.length} core pages</span>
                  <span className="flex items-center gap-1 font-semibold text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Plan this</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
