import React, { useState } from 'react';
import { WebsitePlan, WebsiteCategoryType, DesignStyle } from '../../types/plan';
import {
  FileText,
  Layers,
  Sparkles,
  Plus,
  X,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Clock,
  Cpu,
  Eye,
} from 'lucide-react';

interface LiveProjectPanelProps {
  plan: WebsitePlan;
  onSetProjectName: (name: string) => void;
  onSetType: (type: WebsiteCategoryType) => void;
  onSetStyle: (style: DesignStyle) => void;
  onTogglePage: (page: string) => void;
  onAddPage: (page: string) => void;
  onRemovePage: (page: string) => void;
  onToggleFeature: (feature: string) => void;
  onResetPlan: () => void;
  onOpenSummary: () => void;
}

const CATEGORY_OPTIONS: WebsiteCategoryType[] = [
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

const STYLE_OPTIONS: DesignStyle[] = [
  'Modern',
  'Minimal',
  'Luxury',
  'Creative',
  'Technical',
  'Warm & Approachable',
  'Editorial',
  'Bold & Vibrant',
];

const POPULAR_PAGES = [
  'Home',
  'About',
  'Services',
  'Projects',
  'Contact',
  'Pricing',
  'Blog / News',
  'FAQ',
  'Case Studies',
  'Testimonials',
];

const POPULAR_FEATURES = [
  'Contact Form',
  'Authentication',
  'Booking',
  'Payments',
  'Dashboard',
  'Gallery',
  'AI Assistant',
  'Search & Filter',
  'CMS Integration',
  'Newsletter Signup',
];

export const LiveProjectPanel: React.FC<LiveProjectPanelProps> = ({
  plan,
  onSetProjectName,
  onSetType,
  onSetStyle,
  onTogglePage,
  onAddPage,
  onRemovePage,
  onToggleFeature,
  onResetPlan,
  onOpenSummary,
}) => {
  const [newPageInput, setNewPageInput] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  const handleAddPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPageInput.trim()) {
      onAddPage(newPageInput.trim());
      setNewPageInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0D121D] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-[#111726] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white tracking-tight">Live Project Plan</h3>
            <p className="text-[11px] text-slate-400">Interactive architectural blueprint</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onResetPlan}
            title="Reset Plan to Default"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={onOpenSummary}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-indigo-600/30"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Summary</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        {/* Project Name Row */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Project Name
          </label>
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={plan.projectName}
                onChange={(e) => onSetProjectName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                autoFocus
                className="w-full bg-[#151C2C] border border-indigo-500 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
              />
              <button
                onClick={() => setIsEditingName(false)}
                className="px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs"
              >
                Done
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingName(true)}
              className="group flex items-center justify-between p-2.5 bg-[#141A28] border border-slate-800 rounded-xl hover:border-slate-700 cursor-pointer transition-colors"
            >
              <span className="font-bold text-white text-sm">{plan.projectName}</span>
              <span className="text-[11px] text-slate-400 group-hover:text-indigo-400 transition-colors">
                Edit
              </span>
            </div>
          )}
        </div>

        {/* Website Type Selector */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Website Type
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
            {CATEGORY_OPTIONS.map((cat) => {
              const active = plan.type === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSetType(cat)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left truncate transition-colors ${
                    active
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'bg-[#141A28] text-slate-300 hover:bg-slate-800/80 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Style Selector */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Design Direction & Style
          </label>
          <div className="flex flex-wrap gap-1.5">
            {STYLE_OPTIONS.map((style) => {
              const active = plan.style === style;
              return (
                <button
                  key={style}
                  onClick={() => onSetStyle(style)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 font-semibold'
                      : 'bg-[#141A28] text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pages Architecture */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Information Architecture ({plan.pages.length} Pages)
            </label>
            <span className="text-[10px] text-slate-500">Toggle or add custom</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {plan.pages.map((page) => (
              <span
                key={page}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#182032] border border-slate-700/80 rounded-lg text-xs text-white"
              >
                <span>{page}</span>
                <button
                  onClick={() => onRemovePage(page)}
                  className="text-slate-400 hover:text-rose-400 p-0.5 rounded transition-colors"
                  aria-label={`Remove ${page}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Quick toggle suggestion pages */}
          <div className="pt-1">
            <span className="text-[10px] text-slate-400 block mb-1">Add suggested page:</span>
            <div className="flex flex-wrap gap-1">
              {POPULAR_PAGES.filter((p) => !plan.pages.includes(p)).slice(0, 5).map((page) => (
                <button
                  key={page}
                  onClick={() => onTogglePage(page)}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-2.5 h-2.5 text-indigo-400" />
                  <span>{page}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Add custom page input */}
          <form onSubmit={handleAddPageSubmit} className="flex gap-1.5 pt-1">
            <input
              type="text"
              value={newPageInput}
              onChange={(e) => setNewPageInput(e.target.value)}
              placeholder="Add custom page..."
              className="flex-1 bg-[#141A28] border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!newPageInput.trim()}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              Add
            </button>
          </form>
        </div>

        {/* Features Checklist */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Core Features & Integrations ({plan.features.length} Selected)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {POPULAR_FEATURES.map((feature) => {
              const active = plan.features.includes(feature);
              return (
                <button
                  key={feature}
                  onClick={() => onToggleFeature(feature)}
                  className={`p-2 rounded-xl text-left border transition-colors flex items-center justify-between text-xs ${
                    active
                      ? 'bg-indigo-950/30 border-indigo-500/40 text-indigo-200'
                      : 'bg-[#141A28] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="font-medium truncate">{feature}</span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ml-1 ${
                      active ? 'bg-indigo-600 text-white' : 'border border-slate-700'
                    }`}
                  >
                    {active && <Check className="w-2.5 h-2.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Estimated Quick Scope Indicators */}
        <div className="p-3.5 rounded-xl bg-[#141A28] border border-slate-800 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Est. Development</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-bold text-white tabular-nums">{plan.estimatedTimeline}</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Complexity Score</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-white">{plan.estimatedComplexity}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
