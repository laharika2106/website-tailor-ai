import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/hero/HeroSection';
import { HowItWorksSection } from './components/howItWorks/HowItWorksSection';
import { CategoriesSection } from './components/categories/CategoriesSection';
import { NathanChat } from './components/chat/NathanChat';
import { LiveProjectPanel } from './components/planner/LiveProjectPanel';
import { TemplateGallery } from './components/templates/TemplateGallery';
import { WebsiteEstimator } from './components/estimator/WebsiteEstimator';
import { ProjectSummaryModal } from './components/summary/ProjectSummaryModal';
import { WebhookSettingsModal } from './components/common/WebhookSettingsModal';

import { useN8nChat } from './hooks/useN8nChat';
import { useWebsitePlan } from './hooks/useWebsitePlan';
import { CategoryInfo, TemplateItem } from './types/plan';
import { MessageSquare, Layers } from 'lucide-react';

export default function App() {
  const {
    messages,
    isLoading,
    error,
    sessionId,
    isConfigured,
    sendMessage,
    retryLastMessage,
    startNewConversation,
    clearConversation,
    refreshConfig,
  } = useN8nChat();

  const {
    plan,
    setProjectName,
    setType,
    setStyle,
    togglePage,
    addCustomPage,
    removePage,
    toggleFeature,
    applyCategory,
    applyTemplate,
    resetPlan,
    getFormattedMarkdown,
    setPlan,
  } = useWebsitePlan();

  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [suggestedPromptInput, setSuggestedPromptInput] = useState<string | null>(null);
  const [mobileStudioTab, setMobileStudioTab] = useState<'chat' | 'panel'>('chat');

  const scrollToPlanner = () => {
    const el = document.getElementById('planner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTemplates = () => {
    const el = document.getElementById('templates');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectCategory = (category: CategoryInfo) => {
    applyCategory(category);
    setSuggestedPromptInput(category.suggestedPrompt);
    scrollToPlanner();
  };

  const handleSelectTemplate = (template: TemplateItem) => {
    applyTemplate(template);
    setSuggestedPromptInput(
      `I want to use the ${template.title} style (${template.style} ${template.category}). Help me plan the content and structure.`
    );
    scrollToPlanner();
  };

  const handleApplyEstimatorToPlan = (data: {
    category: any;
    pageCount: number;
    features: string[];
    complexity: 'Standard' | 'Enhanced' | 'Bespoke';
  }) => {
    setPlan((prev) => ({
      ...prev,
      type: data.category,
      features: data.features.length > 0 ? data.features : prev.features,
      designComplexity: data.complexity,
      lastUpdated: Date.now(),
    }));
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sticky Navigation */}
      <Navbar
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        isConfigured={isConfigured}
        onTalkToNathan={scrollToPlanner}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onStartBuilding={scrollToPlanner}
          onExploreTemplates={scrollToTemplates}
        />

        {/* How It Works */}
        <HowItWorksSection onStartPlanning={scrollToPlanner} />

        {/* Website Categories */}
        <CategoriesSection onSelectCategory={handleSelectCategory} />

        {/* Core AI Assistant & Live Planner Studio Section */}
        <section id="planner" className="py-20 lg:py-28 border-t border-slate-800/80 bg-[#090D15] scroll-mt-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div className="space-y-3 max-w-xl">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                  Interactive Planning Studio
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                  Chat with Nathan · Live Architecture
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Tell Nathan what you want to achieve. As you discuss requirements, adjust your live specification panel in real time.
                </p>
              </div>

              {/* Mobile Tab Switcher */}
              <div className="lg:hidden flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl self-start">
                <button
                  onClick={() => setMobileStudioTab('chat')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    mobileStudioTab === 'chat'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Nathan AI</span>
                </button>
                <button
                  onClick={() => setMobileStudioTab('panel')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    mobileStudioTab === 'panel'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Project Plan</span>
                </button>
              </div>
            </div>

            {/* Desktop Side-by-Side Grid & Mobile Tabbed View */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[640px] max-h-[820px]">
              {/* Left Column: Nathan Chat */}
              <div
                className={`lg:col-span-7 h-[640px] sm:h-[720px] lg:h-[780px] ${
                  mobileStudioTab === 'chat' ? 'block' : 'hidden lg:block'
                }`}
              >
                <NathanChat
                  messages={messages}
                  isLoading={isLoading}
                  error={error}
                  sessionId={sessionId}
                  isConfigured={isConfigured}
                  onSendMessage={sendMessage}
                  onRetry={retryLastMessage}
                  onNewConversation={startNewConversation}
                  onClearConversation={clearConversation}
                  onOpenSettings={() => setIsSettingsModalOpen(true)}
                  suggestedPromptInput={suggestedPromptInput}
                  onClearSuggestedPrompt={() => setSuggestedPromptInput(null)}
                />
              </div>

              {/* Right Column: Live Project Blueprint Panel */}
              <div
                className={`lg:col-span-5 h-[640px] sm:h-[720px] lg:h-[780px] ${
                  mobileStudioTab === 'panel' ? 'block' : 'hidden lg:block'
                }`}
              >
                <LiveProjectPanel
                  plan={plan}
                  onSetProjectName={setProjectName}
                  onSetType={setType}
                  onSetStyle={setStyle}
                  onTogglePage={togglePage}
                  onAddPage={addCustomPage}
                  onRemovePage={removePage}
                  onToggleFeature={toggleFeature}
                  onResetPlan={resetPlan}
                  onOpenSummary={() => setIsSummaryModalOpen(true)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Template Gallery */}
        <TemplateGallery onSelectTemplate={handleSelectTemplate} />

        {/* Website Estimator */}
        <WebsiteEstimator
          initialCategory={plan.type}
          onApplyToPlan={handleApplyEstimatorToPlan}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Project Summary Modal */}
      <ProjectSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        plan={plan}
        onStartNewProject={() => {
          resetPlan();
          startNewConversation();
        }}
        getFormattedMarkdown={getFormattedMarkdown}
      />

      {/* Webhook Configuration Modal */}
      <WebhookSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onUpdated={refreshConfig}
      />
    </div>
  );
}
