import { BaseEntity } from '../common/base';
import { Difficulty } from '../settings';

export enum LearningStatus {
  NEW = 'new',
  LEARNING = 'learning',
  MASTERED = 'mastered',
}

export interface Word extends BaseEntity {
    userId:string,
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
