import React, { useState } from 'react';
import { ArrowRight, Layers, Layout, Palette, Sparkles, Check, Monitor, Smartphone } from 'lucide-react';

interface HeroSectionProps {
  onStartBuilding: () => void;
  onExploreTemplates: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartBuilding,
  onExploreTemplates,
}) => {
  const [activePreviewDevice, setActivePreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTheme, setActiveTheme] = useState<'indigo' | 'emerald' | 'amber'>('indigo');
  const [activeLayout, setActiveLayout] = useState<'bento' | 'minimal' | 'split'>('bento');

  const themeColors = {
    indigo: {
      accent: 'bg-indigo-500',
      text: 'text-indigo-400',
      border: 'border-indigo-500/30',
      glow: 'shadow-indigo-500/20',
      pill: 'bg-indigo-500/10 text-indigo-300',
    },
    emerald: {
      accent: 'bg-emerald-500',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      glow: 'shadow-emerald-500/20',
      pill: 'bg-emerald-500/10 text-emerald-300',
    },
    amber: {
      accent: 'bg-amber-500',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      glow: 'shadow-amber-500/20',
      pill: 'bg-amber-500/10 text-amber-300',
    },
  };

  const currentTheme = themeColors[activeTheme];

  return (
    <section id="hero" className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
      {/* Subtle radial backdrop glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span>AI-Powered Website Planning Assistant</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
              Your idea.{' '}
              <span className="bg-gradient-to-r from-indigo-300 via-indigo-200 to-white bg-clip-text text-transparent">
                Your style.
              </span>{' '}
              <br />
              Your website.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed text-balance">
              Tell Nathan what you want to build and turn your ideas into a clear website plan with AI-powered guidance.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartBuilding}
                className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 group"
              >
                <span>Start Building</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onExploreTemplates}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4 text-slate-400" />
                <span>Explore Templates</span>
              </button>
            </div>

            {/* Proof metrics row */}
            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-center lg:justify-start gap-8 text-xs text-slate-400">
              <div className="flex flex-col">
                <span className="text-base font-bold text-white tabular-nums">12+</span>
                <span className="text-slate-400">Website Categories</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="flex flex-col">
                <span className="text-base font-bold text-white tabular-nums">100%</span>
                <span className="text-slate-400">Structured Plans</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="flex flex-col">
                <span className="text-base font-bold text-white tabular-nums">n8n</span>
                <span className="text-slate-400">Agent Integration</span>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Interactive Website / Dashboard Preview */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Device & Customizer Toolbar */}
              <div className="mb-3 flex items-center justify-between px-2 text-xs">
                <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
                  <button
                    onClick={() => setActivePreviewDevice('desktop')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1.5 ${
                      activePreviewDevice === 'desktop'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    onClick={() => setActivePreviewDevice('mobile')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors flex items-center gap-1.5 ${
                      activePreviewDevice === 'mobile'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>

                {/* Live Palette Switcher */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 hidden sm:inline">Palette</span>
                  <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
                    <button
                      onClick={() => setActiveTheme('indigo')}
                      className={`w-4 h-4 rounded-full bg-indigo-500 transition-transform ${
                        activeTheme === 'indigo' ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                      aria-label="Indigo theme"
                    />
                    <button
                      onClick={() => setActiveTheme('emerald')}
                      className={`w-4 h-4 rounded-full bg-emerald-500 transition-transform ${
                        activeTheme === 'emerald' ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                      aria-label="Emerald theme"
                    />
                    <button
                      onClick={() => setActiveTheme('amber')}
                      className={`w-4 h-4 rounded-full bg-amber-500 transition-transform ${
                        activeTheme === 'amber' ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                      aria-label="Amber theme"
                    />
                  </div>
                </div>
              </div>

              {/* Main Preview Container */}
              <div
                className={`transition-all duration-300 mx-auto rounded-2xl bg-[#0D121D] border border-slate-700/80 shadow-2xl p-4 sm:p-5 relative ${
                  activePreviewDevice === 'mobile' ? 'max-w-[320px]' : 'w-full'
                }`}
              >
                {/* Browser top chrome */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="bg-slate-900/90 border border-slate-800 px-3 py-1 rounded text-[11px] text-slate-400 font-mono flex items-center gap-1.5 max-w-[200px] truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>preview.tailor.app</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">Live Canvas</div>
                </div>

                {/* Simulated Tailored Website Content */}
                <div className="space-y-4">
                  {/* Top Bar of Tailored Site */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-md ${currentTheme.accent} flex items-center justify-center text-white text-[10px] font-bold`}>
                        A
                      </div>
                      <span className="text-xs font-bold text-white">Apex Design</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="text-slate-200">Work</span>
                      <span>Services</span>
                      <span>About</span>
                    </div>
                    <div className={`px-2.5 py-1 rounded-md text-[10px] font-semibold text-white ${currentTheme.accent}`}>
                      Get in Touch
                    </div>
                  </div>

                  {/* Hero Block in Canvas */}
                  <div className="p-4 sm:p-6 rounded-xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 space-y-3">
                    <div className="inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span>Nathan Tailored Blueprint</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                      Crafting Distinctive Digital Experiences for Bold Brands
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Strategic brand design, full-stack architecture, and frictionless user flows designed for exponential conversion.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white ${currentTheme.accent}`}>
                        View Projects
                      </div>
                      <div className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 border border-slate-700/60">
                        Schedule Call
                      </div>
                    </div>
                  </div>

                  {/* Bento Grid Feature Preview */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/70 space-y-1.5">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Page Architecture</div>
                      <div className="text-xs font-bold text-slate-200">5 High-Fi Pages</div>
                      <div className="text-[11px] text-slate-400">Home · Works · About · Contact</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/70 space-y-1.5">
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Features Included</div>
                      <div className="text-xs font-bold text-slate-200">Stripe & Booking</div>
                      <div className="text-[11px] text-slate-400">Lead capture + calendar sync</div>
                    </div>
                  </div>

                  {/* Real-time Assistant Annotation Chip */}
                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-slate-300 font-medium">Nathan: Blueprint synchronized</span>
                    </div>
                    <span className="text-[11px] text-indigo-300 underline cursor-pointer" onClick={onStartBuilding}>
                      Customize Plan →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
