import React from 'react';
import { MessageSquareText, Sparkles, Sliders, FileCheck2, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onStartPlanning: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksProps> = ({ onStartPlanning }) => {
  const steps = [
    {
      step: '01',
      title: 'Tell us your idea',
      description: 'Describe the website you want to build in natural language. Mention your industry, goal, or target audience.',
      icon: MessageSquareText,
      accent: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400',
    },
    {
      step: '02',
      title: 'Chat with Nathan',
      description: 'Nathan asks intelligent questions about your requirements, user journey, required integrations, and branding taste.',
      icon: Sparkles,
      accent: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-400',
    },
    {
      step: '03',
      title: 'Shape your website',
      description: 'Choose pages, features, design direction, and functionality with immediate live blueprint preview and tweaking.',
      icon: Sliders,
      accent: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
    },
    {
      step: '04',
      title: 'Build your plan',
      description: 'Receive a structured website plan with pages, tech stack, and scope that can later be handed over or turned into a real project.',
      icon: FileCheck2,
      accent: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28 border-t border-slate-800/80 bg-[#0B0F17] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <span>Seamless 4-Step Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            From raw concept to developer-ready plan
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed text-balance">
            Skip guesswork and endless scoping meetings. Nathan guides you step-by-step through every structural decision.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl bg-[#0F1420] border border-slate-800/80 p-6 flex flex-col justify-between hover:border-slate-700 transition-all group"
              >
                <div>
                  {/* Top Step Row */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-indigo-400 transition-colors">
                      {item.step}
                    </span>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.accent} border flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800/60 flex items-center text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
                  <span>Step {index + 1} of 4</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive CTA strip */}
        <div className="mt-12 text-center">
          <button
            onClick={onStartPlanning}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:border-indigo-500/50 hover:bg-slate-800 transition-all"
          >
            <span>Ready to plan? Chat with Nathan now</span>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
