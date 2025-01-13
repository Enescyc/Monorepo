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