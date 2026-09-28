import React, { useState } from 'react';
import { WebsitePlan } from '../../types/plan';
import {
  X,
  Copy,
  Check,
  Download,
  RotateCcw,
  FileText,
  Clock,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ProjectSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: WebsitePlan;
  onStartNewProject: () => void;
  getFormattedMarkdown: () => string;
}

export const ProjectSummaryModal: React.FC<ProjectSummaryModalProps> = ({
  isOpen,
  onClose,
  plan,
  onStartNewProject,
  getFormattedMarkdown,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      const text = getFormattedMarkdown();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy to clipboard', e);
    }
  };

  const handleDownloadMarkdown = () => {
    const text = getFormattedMarkdown();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${plan.projectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_website_plan.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(plan, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${plan.projectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_plan.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#0D121D] border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">{plan.projectName} — Plan Summary</h2>
              <p className="text-xs text-slate-400">
                Architectural scoping & specification blueprint
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close Summary Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Summary Body */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6 text-xs sm:text-sm text-slate-300">
          {/* Top Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#141A28] border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Archetype</span>
              <div className="font-bold text-white text-sm">{plan.type}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#141A28] border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Design Style</span>
              <div className="font-bold text-white text-sm">{plan.style}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#141A28] border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Complexity</span>
              <div className="font-bold text-emerald-400 text-sm">{plan.estimatedComplexity}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#141A28] border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Est. Timeline</span>
              <div className="font-bold text-indigo-300 text-sm font-mono tabular-nums">{plan.estimatedTimeline}</div>
            </div>
          </div>

          {/* Purpose & Target Audience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#141A28] border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Purpose & Value Proposition
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{plan.purpose}</p>
            </div>
            <div className="p-4 rounded-xl bg-[#141A28] border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Target Audience
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{plan.targetAudience}</p>
            </div>
          </div>

          {/* Pages Architecture */}
          <div className="p-4 rounded-xl bg-[#141A28] border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Information Architecture ({plan.pages.length} Pages)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {plan.pages.map((page, index) => (
                <span
                  key={page}
                  className="px-3 py-1 bg-slate-900 border border-slate-700/80 rounded-lg text-xs font-medium text-slate-200"
                >
                  <span className="text-indigo-400 font-mono text-[10px] mr-1.5">{index + 1}.</span>
                  {page}
                </span>
              ))}
            </div>
          </div>

          {/* Features & Integrations */}
          <div className="p-4 rounded-xl bg-[#141A28] border border-slate-800 space-y-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Core Features & Integrations ({plan.features.length})
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {plan.features.map((feat) => (
                <div
                  key={feat}
                  className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-2 text-xs text-slate-300"
                >
                  <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Tech Stack */}
          <div className="p-4 rounded-xl bg-[#141A28] border border-slate-800 space-y-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Recommended Technology Stack
            </span>
            <div className="flex flex-wrap gap-2">
              {plan.suggestedStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-indigo-950/40 border border-indigo-500/30 rounded-lg text-xs font-mono text-indigo-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold tracking-wide transition-all shadow-md shadow-indigo-600/25 flex items-center gap-2 active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Plan Copied!' : 'Copy Plan'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download .md</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-medium transition-colors"
            >
              JSON
            </button>
          </div>

          <button
            onClick={() => {
              if (confirm('Start a new project? This will reset your current plan.')) {
                onStartNewProject();
                onClose();
              }
            }}
            className="px-4 py-2.5 bg-slate-900 hover:bg-rose-950/60 hover:text-rose-200 text-slate-400 border border-slate-800 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start New Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};
