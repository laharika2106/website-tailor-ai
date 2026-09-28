import React, { useState } from 'react';
import { TEMPLATES_DATA } from '../../data/templates';
import { TemplateItem } from '../../types/plan';
import { ArrowRight, Sparkles, Check, ExternalLink } from 'lucide-react';

interface TemplateGalleryProps {
  onSelectTemplate: (template: TemplateItem) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ onSelectTemplate }) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Portfolio', 'SaaS', 'E-commerce', 'Restaurant', 'Business', 'Education', 'Event'];

  const filteredTemplates = activeCategoryFilter === 'All'
    ? TEMPLATES_DATA
    : TEMPLATES_DATA.filter((tpl) => tpl.category === activeCategoryFilter);

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="templates" className="py-20 lg:py-28 border-t border-slate-800/80 bg-[#0B0F17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Curated Starting Points
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Template Gallery
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Explore design archetypes crafted for high-performing modern web presences. Pick a style to prime Nathan's architectural plan.
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeCategoryFilter === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => {
            const hasImgError = imageErrors[template.id];

            return (
              <div
                key={template.id}
                className="rounded-2xl bg-[#0F1422] border border-slate-800/80 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all group hover:shadow-xl hover:shadow-indigo-950/20"
              >
                <div>
                  {/* Preview Image with Fallback */}
                  <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden border-b border-slate-800/80">
                    {!hasImgError ? (
                      <img
                        src={template.imagePath}
                        alt={template.title}
                        referrerPolicy="no-referrer"
                        onError={() => handleImageError(template.id)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      /* Styled Fallback Container (Zero-Broken-Image Policy) */
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-indigo-950/40 text-center">
                        <Sparkles className="w-8 h-8 text-indigo-400 mb-2 opacity-60" />
                        <span className="text-xs font-bold text-white">{template.title}</span>
                        <span className="text-[10px] text-slate-400">{template.category} Template</span>
                      </div>
                    )}

                    {/* Gradient scrim for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1422] via-transparent to-transparent opacity-60" />

                    {/* Unboxed Metadata (Zero-Pill Rule) */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white font-medium drop-shadow-md">
                      <div className="flex items-center gap-1.5">
                        <span>{template.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{template.style}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-200 transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {template.description}
                    </p>

                    {/* Key features unboxed list */}
                    <div className="pt-2 border-t border-slate-800/70 space-y-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 block">
                        Included Features
                      </span>
                      <div className="space-y-1 text-[11px] text-slate-300">
                        {template.features.slice(0, 3).map((f) => (
                          <div key={f} className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-indigo-400 shrink-0" />
                            <span className="truncate">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => onSelectTemplate(template)}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-800 hover:border-indigo-500 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 group-hover:bg-indigo-600 group-hover:text-white active:scale-95"
                  >
                    <span>Use this style</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
