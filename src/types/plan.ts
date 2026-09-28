export type WebsiteCategoryType =
  | 'Portfolio'
  | 'Business'
  | 'E-commerce'
  | 'Restaurant'
  | 'Education'
  | 'Blog'
  | 'SaaS'
  | 'Event'
  | 'Healthcare'
  | 'Travel'
  | 'Creative'
  | 'Custom Website';

export type DesignStyle =
  | 'Modern'
  | 'Minimal'
  | 'Luxury'
  | 'Creative'
  | 'Technical'
  | 'Warm & Approachable'
  | 'Editorial'
  | 'Bold & Vibrant';

export type ComplexityLevel = 'Simple' | 'Moderate' | 'High' | 'Enterprise';

export interface WebsitePlan {
  projectName: string;
  type: WebsiteCategoryType;
  style: DesignStyle;
  purpose: string;
  targetAudience: string;
  pages: string[];
  features: string[];
  designComplexity: 'Standard' | 'Enhanced' | 'Bespoke';
  suggestedStack: string[];
  estimatedTimeline: string;
  estimatedComplexity: ComplexityLevel;
  lastUpdated: number;
}

export interface CategoryInfo {
  id: string;
  name: WebsiteCategoryType;
  tagline: string;
  description: string;
  iconName: string;
  defaultPages: string[];
  suggestedFeatures: string[];
  defaultStyle: DesignStyle;
  suggestedPrompt: string;
  badge?: string;
}

export interface TemplateItem {
  id: string;
  title: string;
  category: WebsiteCategoryType;
  style: DesignStyle;
  description: string;
  imagePath: string;
  featuredPages: string[];
  features: string[];
  accentColor: string;
}

export interface EstimatorSettings {
  category: WebsiteCategoryType;
  pageCount: number;
  selectedFeatures: string[];
  designComplexity: 'Standard' | 'Enhanced' | 'Bespoke';
}

export interface EstimationResult {
  complexity: ComplexityLevel;
  developmentTime: string;
  suggestedStack: string[];
  keyConsiderations: string[];
}
