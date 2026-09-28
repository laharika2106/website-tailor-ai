import React from 'react';
import { Sparkles, Github, Twitter, Linkedin, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-800/80 bg-[#070A0F] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <a href="#hero" className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-outfit">Website Tailor</span>
            </a>
            <p className="text-xs text-slate-400 leading-relaxed">
              Turn your website idea into a plan. Powered by intelligent conversational requirements gathering and architecture scoping.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-slate-700 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-slate-700 transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white hover:border-slate-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Col: Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Overview
                </a>
              </li>
              <li>
                <a href="#planner" className="hover:text-white transition-colors">
                  Live Planner
                </a>
              </li>
              <li>
                <a href="#templates" className="hover:text-white transition-colors">
                  Templates
                </a>
              </li>
              <li>
                <a href="#estimator" className="hover:text-white transition-colors">
                  Website Estimator
                </a>
              </li>
            </ul>
          </div>

          {/* Nav Col: Architecture */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Resources & Integration
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#categories" className="hover:text-white transition-colors">
                  Website Categories
                </a>
              </li>
              <li>
                <span className="text-slate-500">n8n Webhook Architecture</span>
              </li>
              <li>
                <span className="text-slate-500">Requirements Spec Format</span>
              </li>
            </ul>
          </div>

          {/* Nav Col: About & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Support & Trust
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <span className="hover:text-slate-300 cursor-pointer">Help & Documentation</span>
              </li>
              <li>
                <span className="hover:text-slate-300 cursor-pointer">Privacy & Local Storage</span>
              </li>
              <li>
                <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
              </li>
              <li>
                <button
                  onClick={scrollToTop}
                  className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors pt-2 font-medium"
                >
                  <ArrowUp className="w-3.5 h-3.5" /> Back to top
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Website Tailor. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Client-side session isolation</span>
            <span aria-hidden="true">·</span>
            <span>External n8n AI webhook ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
