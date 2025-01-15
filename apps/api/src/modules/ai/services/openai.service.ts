import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import OpenAI from 'openai';
import {
  Language,
  AIServiceConfig,
  AIResponse,
  AIWordResponse,
  WordGenerationContext,
  StoryGenerationContext,
  TextToSpeechOptions,
  SpeechComparisonResult,
  AIProvider,
  AIModel,
  AIVoice,
  LearningStatus,
  WordCategories,
  WordCategory,
  WordType,
} from '@vocabuddy/types';
import { AI_CACHE_PREFIX, AI_CACHE_TTL, DEFAULT_AI_CONFIG } from '../constants/ai.constants';

@Injectable()
export class OpenAIService implements AIProvider, OnModuleInit {
  private openai: OpenAI;
  private config: AIServiceConfig;
  private readonly CACHE_PREFIX = AI_CACHE_PREFIX;
  private readonly CACHE_TTL = AI_CACHE_TTL;

  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    
  }     

  onModuleInit() {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not defined');
    }

    this.config = {
      apiKey,
      model: this.configService.get<string>('OPENAI_MODEL') || AIModel.GPT4,
      temperature: this.configService.get<number>('OPENAI_TEMPERATURE') || DEFAULT_AI_CONFIG.temperature,
      maxTokens: this.configService.get<number>('OPENAI_MAX_TOKENS') || DEFAULT_AI_CONFIG.maxTokens,
    };

    this.openai = new OpenAI({
      apiKey: this.config.apiKey,
    });
  }

  private async getCacheKey(...parts: string[]): Promise<string> {
    return [this.CACHE_PREFIX, ...parts].join(':');
  }

  private async getFromCache<T>(key: string): Promise<T | null> {
    const result = await this.cacheManager.get<T>(key);
    return result || null;
  }

  private async setInCache<T>(key: string, value: T, ttl: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async generateText(prompt: string): Promise<AIResponse> {
    const cacheKey = await this.getCacheKey('text', prompt);
    const cachedResponse = await this.getFromCache<AIResponse>(cacheKey);

    if (cachedResponse) {
      console.log("cachedResponse");
      return cachedResponse;
    }

    const completion = await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
  
    });

    const response: AIResponse = {
      content: completion.choices[0]?.message?.content || '',
      usage: {
        promptTokens: completion.usage?.prompt_tokens || 0,
        completionTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0,
      },
      model: completion.model,
    };

    await this.setInCache(cacheKey, response, this.CACHE_TTL);
    return response;
  }

  async generateWord(context: WordGenerationContext): Promise<AIWordResponse> {
    const cacheKey = await this.getCacheKey('word', JSON.stringify(context));
    const cachedResponse = await this.getFromCache<AIWordResponse>(cacheKey);

    if (cachedResponse) {
      return cachedResponse;
    }

    const prompt = this.buildWordGenerationPrompt(context);
    const response = await this.generateText(prompt);

    try {
      const wordData = JSON.parse(response.content);
      const wordResponse: AIWordResponse = {
        ...response,
        word: {
          word: context.word,
          userId: context.userId,
          translations: wordData.translations,
          pronunciation: wordData.pronunciation,
          wordType: wordData.wordType,
          definitions: wordData.definitions,
          examples: wordData.examples,
          category: wordData.category,
          context: wordData.context,
          etymology: wordData.etymology,
          synonymsAntonyms: wordData.synonymsAntonyms,
          learning: {
            status: LearningStatus.NEW,
            strength: 0,
            nextReview: new Date(),
            lastStudied: new Date(),
          },
          createdAt: new Date().getTime(),
          updatedAt: new Date().getTime(),
        },
      };

      await this.setInCache(cacheKey, wordResponse, this.CACHE_TTL);
      return wordResponse;
    } catch (error: any) {
      throw new Error(`Failed to parse AI response: ${error.message}`);
    }
  }

  async generateStory(context: StoryGenerationContext): Promise<AIResponse> {
    const cacheKey = await this.getCacheKey('story', JSON.stringify(context));
    const cachedResponse = await this.getFromCache<AIResponse>(cacheKey);

    if (cachedResponse) {
      return cachedResponse;
    }

    const prompt = this.buildStoryGenerationPrompt(context);
    const response = await this.generateText(prompt);
    await this.setInCache(cacheKey, response, this.CACHE_TTL);
    return response;
  }

  async generateSpeech(text: string, options?: TextToSpeechOptions): Promise<ArrayBuffer> {
    const cacheKey = await this.getCacheKey('speech', text, JSON.stringify(options));
    const cachedResponse = await this.getFromCache<ArrayBuffer>(cacheKey);

    if (cachedResponse) {
      return cachedResponse;
    }

    const speechFile = await this.openai.audio.speech.create({
      model: AIModel.TTS,
      voice: options?.voice || AIVoice.ALLOY,
      input: text,
    });

    const buffer = Buffer.from(await speechFile.arrayBuffer());
    await this.setInCache(cacheKey, buffer, this.CACHE_TTL);
    return buffer;
  }

  async compareSpeech(original: ArrayBuffer, user: ArrayBuffer): Promise<SpeechComparisonResult> {
    // TODO: Implement speech comparison using OpenAI's Whisper API
    // This is a placeholder implementation
    return {
      accuracy: 0,
      pronunciation: {
        score: 0,
        details: [],
      },
      fluency: {
        score: 0,
        feedback: '',
      },
      overall: 0,
    };
  }

  private buildWordGenerationPrompt(context: WordGenerationContext): string {
    return `Generate a detailed word explanation in ${context.appLanguage} for the word "${context.word}".
    Target languages: ${context.targetLanguages.join(', ')}
    Native language: ${context.nativeLanguage}
    Learning styles: ${context.learningStyles}
    Difficulty: ${context.difficulty}
    Word types: ${Object.values(WordType).join(', ') || 'any appropriate type'}
    Word categories: ${WordCategories?.map((category: WordCategory) => `${category.name}: ${category.description}`).join(', ') || 'any appropriate category'}
    The Word is: ${context.word}
    Return a JSON object that strictly follows this TypeScript interface:

    interface Word {
      word: string;
      translations: Array<{ language: string; translation: string }>;
      pronunciation: string;
      wordType: string[];
      definitions: Array<{
        partOfSpeech: string;
        meaning: string;
        examples: string[];
      }>;
      examples: string[];
      category: Array<{
        name: string;
        description: string;
      }>;
      context: {
        sentences: string[];
        usageNotes: string;
        difficulty: string;
        tags: string[];
        tips: string[];
      };
      etymology: {
        origin: string;
        history: string;
      };
      synonymsAntonyms: {
        synonyms: string[];
        antonyms: string[];
      };
    }

    Requirements:
    1. All text content must be in ${context.appLanguage}
    2. Each translation must include the language code and translation
    3. Provide IPA pronunciation
    4. Include at least 2 definitions with examples
    5. Provide at least 3 example sentences
    6. Add relevant categories (e.g., "Academic", "Business", "Casual")
    7. Include comprehensive context information
    8. Research and provide etymology if available
    9. List at least 3 synonyms and antonyms if applicable
    10. Adapt examples and tips to the user's learning styles: ${context.learningStyles}
    11. Ensure all content matches the difficulty level: ${context.difficulty}

    Format the response as a valid JSON object that exactly matches the interface structure.`;
  }

  private buildStoryGenerationPrompt(context: StoryGenerationContext): string {
    return `Create a ${context.length} ${context.difficulty} level story in ${context.language.name}
    incorporating the following words: ${context.words.join(', ')}.
    ${context.theme ? `The story should follow the theme: ${context.theme}.` : ''}
    ${context.genre ? `Genre: ${context.genre}` : ''}
    
    Requirements:
    1. Use each word naturally in context
    2. Highlight the target words in the story
    3. Include a brief explanation of how each word was used
    4. Add cultural context where relevant
    5. Include a vocabulary list with definitions
    6. Add comprehension questions
    7. Provide language learning tips
    
    Format the response as a JSON object with the story, word usage explanations, and learning materials.`;
  }
} 