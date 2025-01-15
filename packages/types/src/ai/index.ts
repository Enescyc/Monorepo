import { Language } from '../language';
import { Difficulty, LearningStyle } from '../settings';
import { Word, WordType } from '../word';

export interface AIServiceConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
}

export interface AIWordResponse extends AIResponse {
  word: Omit<Word, 'id'>;
}

export interface AIProvider {
  generateText(prompt: string): Promise<AIResponse>;
  generateWord(context: WordGenerationContext): Promise<AIWordResponse>;
  generateStory(context: StoryGenerationContext): Promise<AIResponse>;
  generateSpeech(text: string, options?: TextToSpeechOptions): Promise<ArrayBuffer>;
  compareSpeech(original: ArrayBuffer, user: ArrayBuffer): Promise<SpeechComparisonResult>;
}

export interface WordGenerationContext {
  word: string;
  nativeLanguage: string;
  targetLanguages: Language[];
  userId: string;
  learningStyles: LearningStyle[];
  difficulty: Difficulty;
  appLanguage: string;
}

export interface StoryGenerationContext {
  words: string[];
  difficulty: Difficulty;
  theme?: string;
  length: 'short' | 'medium' | 'long';
  genre?: string;
  language: Language;
  userId: string;
}

export interface TextToSpeechOptions {
  voice?: AIVoice;
  speed?: number;
  pitch?: number;
  format?: 'mp3' | 'wav' | 'ogg';
}

export interface SpeechComparisonResult {
  accuracy: number;
  pronunciation: {
    score: number;
    details: Array<{
      word: string;
      score: number;
      feedback?: string;
    }>;
  };
  fluency: {
    score: number;
    feedback?: string;
  };
  overall: number;
}

export enum AIProviderType {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google',
}

export enum AIModel {
  // OpenAI Models
  GPT4 = 'gpt-4-turbo-preview',
  GPT3 = 'gpt-3.5-turbo',
  TTS = 'tts-1',
  WHISPER = 'whisper-1',
  
  // Anthropic Models
  CLAUDE = 'claude-2',
  
  // Google Models
  GEMINI = 'gemini-pro',
  GEMINI_PRO_VISION = 'gemini-pro-vision',
}

export enum AIVoice {
  // OpenAI Voices
  ALLOY = 'alloy',
  ECHO = 'echo',
  FABLE = 'fable',
  ONYX = 'onyx',
  NOVA = 'nova',
  SHIMMER = 'shimmer',
} 