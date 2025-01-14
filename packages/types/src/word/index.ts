import { BaseEntity } from '../common/base';


export enum LearningStatus {
  NEW = 'new',
  LEARNING = 'learning',
  MASTERED = 'mastered',
}

export interface Word extends BaseEntity {
    userId:string,
    word: string;
    translations: Translation[];
    pronunciation: string;
    wordType: WordType[];
    definitions: Definition[];
    examples: string[];
    category: WordCategory[];
    context: Context;
    etymology: Etymology;
    synonymsAntonyms: SynonymsAntonyms;
    learning: Learning;
}

// write word interface fields to use in ai service



export interface Etymology {
  origin: string;
  history: string;
}

export interface SynonymsAntonyms {
  synonyms: string[];
  antonyms: string[];
}

export interface Learning {
  status: LearningStatus;
  strength: number;
  nextReview: Date;
  lastStudied: Date;
}

export interface Translation {
  language: string;
  translation: string;
}

export interface Definition {
  partOfSpeech: string;
  meaning: string;
  examples: string[];
}

export interface Context {
  sentences: string[];
  usageNotes: string;
  difficulty: string;
  tags: string[];
  source?: string;
  tips: string[];
}

export interface WordCategory {
  name: string;
  description: string;
}

export const WordCategories : WordCategory[] = [
  // fill most common 10 categories
  {
    name: 'Food',
    description: 'Words related to food and cooking'
  },
  {
    name: 'Sports',
    description: 'Words related to sports and physical activities'
  },
  {
    name: 'Technology',
    description: 'Words related to technology and gadgets'
  },
  {
    name: 'Science',
    description: 'Words related to science and nature'
  },
  {
    name: 'Travel',
    description: 'Words related to travel and tourism'
  },
  {
    name: 'Health',
    description: 'Words related to health and medicine'
  },
  {
    name: 'Art',
    description: 'Words related to art and culture'
  },
  {
    name: 'Music',
    description: 'Words related to music and entertainment'
  },
  {
    name: 'History',
    description: 'Words related to history and events'
  },
  {
    name: 'Politics',
    description: 'Words related to politics and government'
  },
  {
    name: 'Religion',
    description: 'Words related to religion and spirituality'
  },
  {
    name: 'Nature',
    description: 'Words related to nature and the environment'
  },
  {
    name: 'Business',
    description: 'Words related to business and finance'
  },
  {
    name: 'Education',
    description: 'Words related to education and learning'
  },

]

export enum WordType {
  NOUN = 'noun',
  VERB = 'verb',
  ADJECTIVE = 'adjective',
  ADVERB = 'adverb',
  PRONOUN = 'pronoun',
  PREPOSITION = 'preposition',
  CONJUNCTION = 'conjunction',
  INTERJECTION = 'interjection',
  ARTICLE = 'article',
  DETERMINER = 'determiner'
}

export enum WordStatus {
  NEW = 'new',
  LEARNING = 'learning',
  REVIEWING = 'reviewing',
  MASTERED = 'mastered'
}

