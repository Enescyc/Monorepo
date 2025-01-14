export const LANGUAGES = {
    ENGLISH: 'en',
    TURKISH: 'tr',
    SPANISH: 'es',
    FRENCH: 'fr',
    GERMAN: 'de',
    ITALIAN: 'it',
    PORTUGUESE: 'pt',
    RUSSIAN: 'ru',
    CHINESE: 'zh',
    JAPANESE: 'ja',
    KOREAN: 'ko',
  } as const;
  
  export type LanguageType = keyof typeof LANGUAGES;