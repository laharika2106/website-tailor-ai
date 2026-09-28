import { useState, useEffect, useCallback } from 'react';
import {
  WebsitePlan,
  WebsiteCategoryType,
  DesignStyle,
  TemplateItem,
  CategoryInfo,
} from '../types/plan';
import { calculateEstimate } from '../data/estimatorData';

const PLAN_STORAGE_KEY = 'website_tailor_live_plan';

const DEFAULT_PLAN: WebsitePlan = {
  projectName: 'My Next Website',
  type: 'Portfolio',
  style: 'Minimal',
  purpose: 'Showcase design case studies, client testimonials, and capture high-value freelance inquiries.',
  targetAudience: 'Design directors, founders, and prospective clients seeking high-end creative work.',
  pages: ['Home', 'Projects', 'Case Studies', 'About Me', 'Contact'],
  features: ['Contact Form', 'Gallery', 'AI Assistant', 'Client Testimonials'],
  designComplexity: 'Enhanced',
  suggestedStack: ['React / Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'],
  estimatedTimeline: '2 – 3 Weeks',
  estimatedComplexity: 'Moderate',
  lastUpdated: Date.now(),
};

export function useWebsitePlan() {
  const [plan, setPlan] = useState<WebsitePlan>(() => {
    try {
      const saved = localStorage.getItem(PLAN_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.projectName) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved website plan', e);
    }
    return DEFAULT_PLAN;
  });

  // Automatically recalculate estimate whenever pages, features, or complexity change
  useEffect(() => {
    try {
      localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
    } catch (e) {
      console.warn('Failed to persist website plan', e);
    }
  }, [plan]);

  const updateEstimate = useCallback(() => {
    const est = calculateEstimate({
      category: plan.type,
      pageCount: plan.pages.length,
      selectedFeatures: plan.features.map((f) => `feat_${f.toLowerCase().replace(/[^a-z]/g, '')}`),
      designComplexity: plan.designComplexity,
    });

    setPlan((prev) => ({
      ...prev,
      estimatedComplexity: est.complexity,
      estimatedTimeline: est.developmentTime,
      suggestedStack: est.suggestedStack,
      lastUpdated: Date.now(),
    }));
  }, [plan.type, plan.pages.length, plan.features, plan.designComplexity]);

  const setProjectName = useCallback((name: string) => {
    setPlan((prev) => ({ ...prev, projectName: name, lastUpdated: Date.now() }));
  }, []);

  const setType = useCallback((type: WebsiteCategoryType) => {
    setPlan((prev) => ({ ...prev, type, lastUpdated: Date.now() }));
  }, []);

  const setStyle = useCallback((style: DesignStyle) => {
    setPlan((prev) => ({ ...prev, style, lastUpdated: Date.now() }));
  }, []);

  const setPurpose = useCallback((purpose: string) => {
    setPlan((prev) => ({ ...prev, purpose, lastUpdated: Date.now() }));
  }, []);

  const setTargetAudience = useCallback((targetAudience: string) => {
    setPlan((prev) => ({ ...prev, targetAudience, lastUpdated: Date.now() }));
  }, []);

  const togglePage = useCallback((pageName: string) => {
    setPlan((prev) => {
      const exists = prev.pages.includes(pageName);
      const newPages = exists
        ? prev.pages.filter((p) => p !== pageName)
        : [...prev.pages, pageName];
      return { ...prev, pages: newPages.length > 0 ? newPages : ['Home'], lastUpdated: Date.now() };
    });
  }, []);

  const addCustomPage = useCallback((pageName: string) => {
    const trimmed = pageName.trim();
    if (!trimmed) return;
    setPlan((prev) => {
      if (prev.pages.includes(trimmed)) return prev;
      return { ...prev, pages: [...prev.pages, trimmed], lastUpdated: Date.now() };
    });
  }, []);

  const removePage = useCallback((pageName: string) => {
    setPlan((prev) => ({
      ...prev,
      pages: prev.pages.filter((p) => p !== pageName),
      lastUpdated: Date.now(),
    }));
  }, []);

  const toggleFeature = useCallback((featureName: string) => {
    setPlan((prev) => {
      const exists = prev.features.includes(featureName);
      const newFeatures = exists
        ? prev.features.filter((f) => f !== featureName)
        : [...prev.features, featureName];
      return { ...prev, features: newFeatures, lastUpdated: Date.now() };
    });
  }, []);

  const setDesignComplexity = useCallback((complexity: 'Standard' | 'Enhanced' | 'Bespoke') => {
    setPlan((prev) => ({ ...prev, designComplexity: complexity, lastUpdated: Date.now() }));
  }, []);

  /**
   * Apply a Category preset into the plan
   */
  const applyCategory = useCallback((cat: CategoryInfo) => {
    setPlan((prev) => ({
      ...prev,
      projectName: `${cat.name} Plan`,
      type: cat.name,
      style: cat.defaultStyle,
      purpose: cat.description,
      pages: [...cat.defaultPages],
      features: [...cat.suggestedFeatures],
      lastUpdated: Date.now(),
    }));
  }, []);

  /**
   * Apply a Template preset into the plan
   */
  const applyTemplate = useCallback((tpl: TemplateItem) => {
    setPlan((prev) => ({
      ...prev,
      projectName: tpl.title,
      type: tpl.category,
      style: tpl.style,
      purpose: tpl.description,
      pages: [...tpl.featuredPages],
      features: [...tpl.features],
      lastUpdated: Date.now(),
    }));
  }, []);

  /**
   * Reset the plan for a fresh start
   */
  const resetPlan = useCallback(() => {
    setPlan({
      ...DEFAULT_PLAN,
      lastUpdated: Date.now(),
    });
    localStorage.removeItem(PLAN_STORAGE_KEY);
  }, []);

  /**
   * Generates formatted markdown output of the plan
   */
  const getFormattedMarkdown = useCallback(() => {
    return `# Website Plan: ${plan.projectName}

**Generated with Website Tailor**
Date: ${new Date(plan.lastUpdated).toLocaleDateString()}

---

## 1. Executive Overview
- **Project Name:** ${plan.projectName}
- **Website Type:** ${plan.type}
- **Design Style:** ${plan.style}
- **Design Complexity:** ${plan.designComplexity}
- **Project Purpose:** ${plan.purpose}
- **Target Audience:** ${plan.targetAudience}

---

## 2. Information Architecture (Pages)
${plan.pages.map((p, i) => `${i + 1}. **${p}**`).join('\n')}

---

## 3. Core Features & Functionality
${plan.features.map((f) => `- [x] ${f}`).join('\n')}

---

## 4. Technical Specifications & Estimation
- **Estimated Development Time:** ${plan.estimatedTimeline}
- **Estimated Architectural Complexity:** ${plan.estimatedComplexity}
- **Recommended Technology Stack:**
${plan.suggestedStack.map((tech) => `  - ${tech}`).join('\n')}

---
*Created using Website Tailor — AI-Powered Website Planning Assistant*
`;
  }, [plan]);

  return {
    plan,
    setPlan,
    setProjectName,
    setType,
    setStyle,
    setPurpose,
    setTargetAudience,
    togglePage,
    addCustomPage,
    removePage,
    toggleFeature,
    setDesignComplexity,
    applyCategory,
    applyTemplate,
    resetPlan,
    updateEstimate,
    getFormattedMarkdown,
  };
}
