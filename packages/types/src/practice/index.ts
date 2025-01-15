import { BaseEntity } from '../common/base';
import { Difficulty } from '../settings';

export interface PracticeSession extends BaseEntity {
  userId: string;
  words: PracticeWord[];
  sessionType: PracticeSessionType;
  duration: number;
  score: number;
  settings: PracticeSessionSettings;
  results: PracticeSessionResults;
}

export interface PracticeSessionSettings {
  difficulty: Difficulty;
  reviewType: ReviewType;
  timeLimit: number;
  wordsLimit: number;
}

export interface PracticeSessionResults {
  totalWords: number;
  correctWords: number;
  incorrectWords: number;
  accuracy: number;
  averageTimePerWord: number;
  streak: number;
  xpEarned: number;
}

export enum ReviewType {
  SPACED = 'spaced',
  RANDOM = 'random',
  WEAK_WORDS = 'weak-words'
}

export interface PracticeWord {
  wordId: string;
  performance: PracticeWordPerformance;
  timeSpent: number;
  attempts: number;
  metadata: Record<string, any>;
}

export enum PracticeWordPerformance {
  PERFECT = 'perfect',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

export enum PracticeSessionType {
  FLASHCARD = 'flashcard',
  QUIZ = 'quiz',
  WRITING = 'writing',
  SPEAKING = 'speaking',
  LISTENING = 'listening'
}

export enum WordSelectionStrategy {
  // Select words that are due for review based on spaced repetition
  SPACED_REPETITION = 'SPACED_REPETITION',
  
  // Select words with lowest strength/mastery level
  WEAKEST_WORDS = 'WEAKEST_WORDS',
  
  // Select words that have been practiced least recently
  LEAST_PRACTICED = 'LEAST_PRACTICED',
  
  // Select words that have the most errors in practice sessions
  MOST_ERRORS = 'MOST_ERRORS',
  
  // Balanced approach considering multiple factors
  BALANCED = 'BALANCED'
} 