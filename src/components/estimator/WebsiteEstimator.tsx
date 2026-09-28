import React, { useState, useMemo } from 'react';
import { WebsiteCategoryType } from '../../types/plan';
import { AVAILABLE_FEATURES, calculateEstimate } from '../../data/estimatorData';
import {
  Calculator,
  Layers,
  Clock,
  Cpu,
  Check,
  Code2,
  Sparkles,
  Info,
  ArrowRight,
} from 'lucide-react';

interface WebsiteEstimatorProps {
  initialCategory?: WebsiteCategoryType;
  onApplyToPlan: (data: {
    category: WebsiteCategoryType;
    pageCount: number;
    features: string[];
    complexity: 'Standard' | 'Enhanced' | 'Bespoke';
  }) => void;
}

const CATEGORIES: WebsiteCategoryType[] = [
  'Portfolio',
  'Business',
  'E-commerce',
  'Restaurant',
  'Education',
  'Blog',
  'SaaS',
  'Event',
  'Healthcare',
  'Travel',
  'Creative',
  'Custom Website',
];

export const WebsiteEstimator: React.FC<WebsiteEstimatorProps> = ({
  initialCategory = 'Business',
  onApplyToPlan,
}) => {
  const [category, setCategory] = useState<WebsiteCategoryType>(initialCategory);
  const [pageCount, setPageCount] = useState<number>(5);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'feat_contact',
    'feat_analytics',
    'feat_gallery',
  ]);
  const [complexity, setComplexity] = useState<'Standard' | 'Enhanced' | 'Bespoke'>('Enhanced');
  const [appliedToast, setAppliedToast] = useState(false);

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const estimate = useMemo(() => {
    return calculateEstimate({
      category,
      pageCount,
      selectedFeatures,
      designComplexity: complexity,
    });
  }, [category, pageCount, selectedFeatures, complexity]);

  const handleApply = () => {
    const featureLabels = selectedFeatures
      .map((id) => AVAILABLE_FEATURES.find((f) => f.id === id)?.label)
      .filter((label): label is string => Boolean(label));

    onApplyToPlan({
      category,
      pageCount,
      features: featureLabels,
      complexity,
    });

    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 2500);
  };

  return (
    <section id="estimator" className="py-20 lg:py-28 border-t border-slate-800/80 bg-[#090D15]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Interactive Scoping Tool
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Website Estimator
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Configure your technical variables to forecast development timeline, architectural complexity, and tailored technology stack.
          </p>
        </div>

        {/* 2-Column Estimator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Inputs */}
          <div className="lg:col-span-7 bg-[#0E131F] border border-slate-800/90 rounded-2xl p-6 sm:p-8 space-y-7">
            {/* 1. Website Type */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                1. Select Website Type
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium text-left truncate transition-colors ${
                      category === cat
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Number of Pages Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  2. Number of Estimated Pages
                </label>
                <span className="text-base font-bold text-white font-mono tabular-nums">
                  {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={pageCount}
                onChange={(e) => setPageCount(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>1 Page (Single Land)</span>
                <span>5-8 (Typical)</span>
                <span>25+ (Portal)</span>
              </div>
            </div>

            {/* 3. Features Multi-Select */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  3. Key Features & Functionality
                </label>
                <span className="text-xs text-slate-500">{selectedFeatures.length} chosen</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AVAILABLE_FEATURES.map((feat) => {
                  const isChecked = selectedFeatures.includes(feat.id);
                  return (
                    <button
                      key={feat.id}
                      onClick={() => toggleFeature(feat.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center justify-between ${
                        isChecked
                          ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="font-medium truncate">{feat.label}</span>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ml-2 ${
                          isChecked ? 'bg-indigo-600 text-white' : 'border border-slate-700'
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Design Complexity Level */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                4. Visual Complexity & Motion Design
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Standard', 'Enhanced', 'Bespoke'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setComplexity(lvl)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      complexity === lvl
                        ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{lvl}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {lvl === 'Standard' && 'Clean layout'}
                      {lvl === 'Enhanced' && 'Subtle animations'}
                      {lvl === 'Bespoke' && 'High-end scrollytelling'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Calculated Projection Card */}
          <div className="lg:col-span-5 bg-[#0F1422] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Estimated Scope Projection</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Live Formula</span>
            </div>

            {/* Key Metric Tiles */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Timeline</span>
                </span>
                <div className="text-lg sm:text-xl font-bold text-white font-mono tabular-nums">
                  {estimate.developmentTime}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Complexity</span>
                </span>
                <div className="text-lg sm:text-xl font-bold text-white">
                  {estimate.complexity}
                </div>
              </div>
            </div>

            {/* Suggested Tech Stack */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                Suggested Technology Stack
              </span>
              <div className="flex flex-wrap gap-1.5">
                {estimate.suggestedStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-medium text-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Architectural Considerations */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                Key Considerations
              </span>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {estimate.keyConsiderations.map((note, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">·</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Disclaimer & Action */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <p className="text-[11px] text-slate-400 leading-relaxed flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  Approximate planning estimates for scoping and developer handoff. Actual velocity depends on asset readiness and custom backend logic.
                </span>
              </p>

              <button
                onClick={handleApply}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Apply to Website Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {appliedToast && (
                <p className="text-xs text-emerald-400 text-center flex items-center justify-center gap-1 animate-fade-in">
                  <Check className="w-3.5 h-3.5" /> Applied to Live Plan successfully!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
