import React, { useState } from 'react';
import { Sparkles, Menu, X, Settings2, CheckCircle2, AlertCircle } from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
  isConfigured: boolean;
  onTalkToNathan: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSettings,
  isConfigured,
  onTalkToNathan,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Categories', href: '#categories' },
    { label: 'Planner', href: '#planner' },
    { label: 'Templates', href: '#templates' },
    { label: 'Estimator', href: '#estimator' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single element brand wordmark */}
        <a
          href="#hero"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white hover:text-indigo-400 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-outfit">Website Tailor</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-white transition-colors relative py-1 hover:underline underline-offset-8 decoration-indigo-500/60"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* n8n Status / Settings Icon Button */}
          <button
            onClick={onOpenSettings}
            title={isConfigured ? 'n8n Webhook: Configured' : 'n8n Webhook: Not Configured (Click to set)'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
          >
            {isConfigured ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
            <span className="hidden lg:inline text-[11px] font-mono">
              {isConfigured ? 'n8n Ready' : 'Config n8n'}
            </span>
            <Settings2 className="w-3 h-3 text-slate-400" />
          </button>

          {/* Primary CTA: Talk to Nathan */}
          <button
            onClick={onTalkToNathan}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold tracking-wide text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-lg transition-all shadow-sm shadow-indigo-600/30 whitespace-nowrap"
          >
            Talk to Nathan
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F141F] border-b border-slate-800 px-4 pt-3 pb-5 space-y-2 animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onTalkToNathan();
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
            >
              Talk to Nathan
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSettings();
              }}
              className="w-full py-2 text-center text-xs text-slate-300 bg-slate-800/80 rounded-lg transition-colors"
            >
              Configure n8n Webhook
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
