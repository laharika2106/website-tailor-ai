import { ComplexityLevel, EstimationResult, EstimatorSettings, WebsiteCategoryType } from '../types/plan';

export const AVAILABLE_FEATURES = [
  { id: 'feat_contact', label: 'Contact & Inquiry Form', points: 1, category: 'Communication' },
  { id: 'feat_auth', label: 'User Authentication / Accounts', points: 4, category: 'Security' },
  { id: 'feat_booking', label: 'Online Booking & Scheduling', points: 3, category: 'Operations' },
  { id: 'feat_payments', label: 'E-commerce Payments (Stripe)', points: 4, category: 'Monetization' },
  { id: 'feat_dashboard', label: 'Client / Admin Dashboard', points: 5, category: 'Application' },
  { id: 'feat_gallery', label: 'Filterable Media & Portfolio Gallery', points: 2, category: 'Content' },
  { id: 'feat_ai', label: 'AI Assistant / Chatbot Integration', points: 4, category: 'Intelligence' },
  { id: 'feat_search', label: 'Live Global Search & Filters', points: 2, category: 'Discovery' },
  { id: 'feat_cms', label: 'Headless CMS (Sanity / Strapi)', points: 3, category: 'Content' },
  { id: 'feat_analytics', label: 'Advanced Analytics & Tracking', points: 1, category: 'Marketing' },
  { id: 'feat_i18n', label: 'Multi-language Localization (i18n)', points: 3, category: 'Global' },
  { id: 'feat_newsletter', label: 'Email Newsletter Capture & Sync', points: 1, category: 'Marketing' },
];

export function calculateEstimate(settings: EstimatorSettings): EstimationResult {
  const { pageCount, selectedFeatures, designComplexity, category } = settings;

  // Base score from pages: ~1.5 points per page
  let score = pageCount * 1.5;

  // Add feature scores
  selectedFeatures.forEach((fid) => {
    const f = AVAILABLE_FEATURES.find((item) => item.id === fid);
    if (f) score += f.points;
  });

  // Multiplier from design complexity
  if (designComplexity === 'Enhanced') score *= 1.25;
  if (designComplexity === 'Bespoke') score *= 1.55;

  // Category nuances
  if (category === 'E-commerce' || category === 'SaaS') score += 4;
  if (category === 'Custom Website') score += 6;

  // Complexity determination
  let complexity: ComplexityLevel = 'Simple';
  let developmentTime = '1 – 2 Weeks';

  if (score < 12) {
    complexity = 'Simple';
    developmentTime = '1 – 2 Weeks';
  } else if (score < 24) {
    complexity = 'Moderate';
    developmentTime = '3 – 5 Weeks';
  } else if (score < 40) {
    complexity = 'High';
    developmentTime = '6 – 8 Weeks';
  } else {
    complexity = 'Enterprise';
    developmentTime = '9 – 14 Weeks';
  }

  // Technology stack recommendations
  const stack = getRecommendedStack(category, complexity, selectedFeatures);

  // Key architectural considerations
  const keyConsiderations = getKeyConsiderations(category, complexity, selectedFeatures);

  return {
    complexity,
    developmentTime,
    suggestedStack: stack,
    keyConsiderations,
  };
}

function getRecommendedStack(
  category: WebsiteCategoryType,
  complexity: ComplexityLevel,
  features: string[]
): string[] {
  const hasPayments = features.includes('feat_payments');
  const hasAuth = features.includes('feat_auth');
  const hasCMS = features.includes('feat_cms');

  const stack: string[] = ['React / Next.js', 'TypeScript', 'Tailwind CSS'];

  if (hasCMS) {
    stack.push('Sanity CMS / Contentful');
  } else if (category === 'Blog' || category === 'Portfolio') {
    stack.push('MDX / Decap CMS');
  }

  if (hasAuth || complexity === 'High' || complexity === 'Enterprise') {
    stack.push('Supabase / NextAuth');
  }

  if (hasPayments) {
    stack.push('Stripe Checkout / Webhooks');
  }

  if (features.includes('feat_ai')) {
    stack.push('n8n Webhook / OpenAI SDK');
  }

  stack.push('Vercel / Cloudflare Deployment');

  return stack;
}

function getKeyConsiderations(
  category: WebsiteCategoryType,
  complexity: ComplexityLevel,
  features: string[]
): string[] {
  const considerations: string[] = [];

  if (features.includes('feat_payments')) {
    considerations.push('PCI compliance handled via Stripe Elements or hosted checkout redirect.');
  }
  if (features.includes('feat_auth')) {
    considerations.push('Role-based access control (RBAC) and secure JWT/cookie session lifecycle.');
  }
  if (features.includes('feat_ai')) {
    considerations.push('Asynchronous webhook dispatch with rate-limiting and fallback fallback states.');
  }
  if (category === 'E-commerce') {
    considerations.push('Cart state persistence in local storage with inventory sync validation.');
  }
  if (complexity === 'High' || complexity === 'Enterprise') {
    considerations.push('Staged milestone delivery: Wireframes → High-Fi Prototype → Backend APIs → QA.');
  } else {
    considerations.push('Fast-track 2-week Sprint with component design system and automated SEO tags.');
  }

  return considerations;
}
