import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Word } from '../entities/word.entity';
import { PracticeSession } from '../../practice/entities/practice.entity';
import { LearningStatus, WordSelectionStrategy } from '@vocabuddy/types';

// Cache TTL in seconds
const CACHE_TTL = {
  ALGORITHMIC: 300, // 5 minutes
  RANDOM: 60, // 1 minute
};

export interface WordSelectionOptions {
  userId: string;
  count: number;
  strategy: WordSelectionStrategy;
  includeRandomPercentage?: number;
  filters?: {
    status?: LearningStatus[];
    minStrength?: number;
    maxStrength?: number;
    categories?: string[];
  };
  useCache?: boolean;
}

export interface WordSelectionResult {
  algorithmicWords: Word[];
  randomWords: Word[];
}

@Injectable()
export class WordSelectionService {
  private readonly logger = new Logger(WordSelectionService.name);

  constructor(
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
    @InjectRepository(PracticeSession)
    private readonly practiceRepository: Repository<PracticeSession>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async selectWords(options: WordSelectionOptions): Promise<WordSelectionResult> {
    const { userId, count, strategy, includeRandomPercentage = 40, useCache = true } = options;
    
    this.logger.debug(`Selecting words for user ${userId} with strategy ${strategy}`);
    this.logger.debug(`Filters: ${JSON.stringify(options.filters)}`);
    
    const algorithmicCount = Math.floor(count * (1 - includeRandomPercentage / 100));
    const randomCount = count - algorithmicCount;

    this.logger.debug(`Algorithmic count: ${algorithmicCount}, Random count: ${randomCount}`);

    // Get words with optional caching
    const [algorithmicWords, randomWords] = await Promise.all([
      this.getAlgorithmicWordsWithCache(userId, algorithmicCount, strategy, options.filters, useCache),
      this.getRandomWordsWithCache(userId, randomCount, options.filters, useCache),
    ]);

    this.logger.debug(`Selected ${algorithmicWords.length} algorithmic words and ${randomWords.length} random words`);

    return {
      algorithmicWords,
      randomWords,
    };
  }

  private async getAlgorithmicWordsWithCache(
    userId: string,
    count: number,
    strategy: WordSelectionStrategy,
    filters?: WordSelectionOptions['filters'],
    useCache = true,
  ): Promise<Word[]> {
    if (!useCache) {
      return this.getAlgorithmicWords(userId, count, strategy, filters);
    }

    const cacheKey = this.generateCacheKey('algorithmic', userId, strategy, filters);
    const cachedWords = await this.cacheManager.get<Word[]>(cacheKey);

    if (cachedWords) {
      return cachedWords.slice(0, count);
    }

    const words = await this.getAlgorithmicWords(userId, count * 2, strategy, filters);
    await this.cacheManager.set(cacheKey, words, CACHE_TTL.ALGORITHMIC);
    
    return words.slice(0, count);
  }

  private async getRandomWordsWithCache(
    userId: string,
    count: number,
    filters?: WordSelectionOptions['filters'],
    useCache = true,
  ): Promise<Word[]> {
    if (!useCache) {
      return this.getRandomWords(userId, count, filters);
    }

    const cacheKey = this.generateCacheKey('random', userId, undefined, filters);
    const cachedWords = await this.cacheManager.get<Word[]>(cacheKey);

    if (cachedWords) {
      return cachedWords.slice(0, count);
    }

    const words = await this.getRandomWords(userId, count * 2, filters);
    await this.cacheManager.set(cacheKey, words, CACHE_TTL.RANDOM);
    
    return words.slice(0, count);
  }

  private generateCacheKey(
    type: 'algorithmic' | 'random',
    userId: string,
    strategy?: WordSelectionStrategy,
    filters?: WordSelectionOptions['filters'],
  ): string {
    const parts = [type, userId];
    
    if (strategy) {
      parts.push(strategy);
    }
    
    if (filters) {
      parts.push(JSON.stringify(filters));
    }
    
    return `word_selection:${parts.join(':')}`;
  }

  private async getAlgorithmicWords(
    userId: string,
    count: number,
    strategy: WordSelectionStrategy,
    filters?: WordSelectionOptions['filters'],
  ): Promise<Word[]> {
    const queryBuilder = this.wordRepository
      .createQueryBuilder('word')
      .where('word.userId = :userId', { userId });

    // Apply filters if provided
    if (filters) {
      if (filters.status?.length) {
        queryBuilder.andWhere('word.learning->>\'status\' IN (:...status)', { 
          status: filters.status 
        });
      }
      if (filters.minStrength !== undefined) {
        queryBuilder.andWhere('(word.learning->>\'strength\')::float >= :minStrength', {
          minStrength: filters.minStrength
        });
      }
      if (filters.maxStrength !== undefined) {
        queryBuilder.andWhere('(word.learning->>\'strength\')::float <= :maxStrength', {
          maxStrength: filters.maxStrength
        });
      }
      if (filters.categories?.length) {
        queryBuilder.andWhere('word.category ?| :categories', {
          categories: filters.categories
        });
      }
    }

    // Apply strategy-specific ordering
    switch (strategy) {
      case WordSelectionStrategy.SPACED_REPETITION:
        queryBuilder
          .andWhere('(word.learning->>\'nextReview\')::timestamp <= :now', { 
            now: new Date().toISOString() 
          })
          .orderBy('(word.learning->>\'nextReview\')::timestamp', 'ASC');
        break;

      case WordSelectionStrategy.WEAKEST_WORDS:
        queryBuilder.orderBy('(word.learning->>\'strength\')::float', 'ASC');
        break;

      case WordSelectionStrategy.LEAST_PRACTICED:
        queryBuilder.orderBy('(word.learning->>\'lastStudied\')::timestamp', 'ASC');
        break;

      case WordSelectionStrategy.MOST_ERRORS:
        // Join with practice sessions to get error counts
        queryBuilder
          .leftJoin(PracticeSession, 'session', 
            'session.userId = word.userId')
          .addSelect(`(
            SELECT COUNT(*)
            FROM jsonb_array_elements(session.words) w
            WHERE w->>'wordId' = word.id::text
            AND w->>'performance' = 'incorrect'
          )`, 'errorCount')
          .orderBy('errorCount', 'DESC');
        break;

      case WordSelectionStrategy.BALANCED:
        // Combine multiple factors with weights
        queryBuilder
          .addSelect(`
            CASE 
              WHEN word.learning->>'status' = 'new' THEN 1
              WHEN word.learning->>'status' = 'learning' THEN 2
              ELSE 3
            END * 0.3 + 
            ((word.learning->>\'strength\')::float * 0.3) +
            (EXTRACT(EPOCH FROM NOW() - (word.learning->>\'lastStudied\')::timestamp) * 0.4)
          `, 'score')
          .orderBy('score', 'DESC');
        break;
    }

    // Log the generated SQL query
    this.logger.debug(`Generated SQL: ${queryBuilder.getSql()}`);
    
    const words = await queryBuilder.take(count).getMany();
    this.logger.debug(`Found ${words.length} words for algorithmic selection`);
    
    return words;
  }

  private async getRandomWords(
    userId: string,
    count: number,
    filters?: WordSelectionOptions['filters'],
  ): Promise<Word[]> {
    const queryBuilder = this.wordRepository
      .createQueryBuilder('word')
      .where('word.userId = :userId', { userId });

    // Apply filters if provided
    if (filters) {
      if (filters.status?.length) {
        queryBuilder.andWhere('word.learning->>\'status\' IN (:...status)', { 
          status: filters.status 
        });
      }
      if (filters.minStrength !== undefined) {
        queryBuilder.andWhere('(word.learning->>\'strength\')::float >= :minStrength', {
          minStrength: filters.minStrength
        });
      }
      if (filters.maxStrength !== undefined) {
        queryBuilder.andWhere('(word.learning->>\'strength\')::float <= :maxStrength', {
          maxStrength: filters.maxStrength
        });
      }
      if (filters.categories?.length) {
        queryBuilder.andWhere('word.category ?| :categories', {
          categories: filters.categories
        });
      }
    }

    // Log the generated SQL query
    this.logger.debug(`Generated SQL for random selection: ${queryBuilder.getSql()}`);

    // Use PostgreSQL's RANDOM() function for random selection
    const words = await queryBuilder
      .orderBy('RANDOM()')
      .take(count)
      .getMany();

    this.logger.debug(`Found ${words.length} words for random selection`);
    
    return words;
  }
} 