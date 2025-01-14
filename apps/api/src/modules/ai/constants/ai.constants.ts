export const AI_CACHE_PREFIX = 'ai';
export const AI_CACHE_TTL = 60 * 60 * 24; // 24 hours

export const DEFAULT_AI_CONFIG = {
  temperature: 0.7,
  maxTokens: 2000,
  model: 'gpt-3.5-turbo',
} as const; 