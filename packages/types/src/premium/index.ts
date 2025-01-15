export interface Premium {
  isActive: boolean;
  plan: PremiumPlan;
  expiresAt: Date | null;
  features: PremiumFeature[];
}

export enum PremiumPlan {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro'
}

export enum PremiumFeature {
  UNLIMITED_WORDS = 'unlimited_words',
  ADVANCED_ANALYTICS = 'advanced_analytics',
  PRIORITY_SUPPORT = 'priority_support',
  ENHANCED_PRACTICE = 'enhanced_practice',
  CUSTOM_LISTS = 'custom_lists',
  AI_SUGGESTIONS = 'ai_suggestions',
  OFFLINE_ACCESS = 'offline_access'
}

export interface PremiumPricing {
  plan: PremiumPlan;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: PremiumFeature[];
}

export const PREMIUM_PLANS: PremiumPricing[] = [
  {
    plan: PremiumPlan.BASIC,
    price: 4.99,
    currency: 'USD',
    interval: 'month',
    features: [
      PremiumFeature.UNLIMITED_WORDS,
      PremiumFeature.ADVANCED_ANALYTICS,
      PremiumFeature.PRIORITY_SUPPORT
    ]
  },
  {
    plan: PremiumPlan.PRO,
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    features: [
      PremiumFeature.UNLIMITED_WORDS,
      PremiumFeature.ADVANCED_ANALYTICS,
      PremiumFeature.PRIORITY_SUPPORT,
      PremiumFeature.ENHANCED_PRACTICE,
      PremiumFeature.CUSTOM_LISTS,
      PremiumFeature.AI_SUGGESTIONS,
      PremiumFeature.OFFLINE_ACCESS
    ]
  }
]; 