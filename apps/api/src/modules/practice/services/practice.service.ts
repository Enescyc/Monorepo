import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PracticeSession } from '../entities/practice.entity';
import { WordSelectionService } from '../../words/services/word-selection.service';
import { 
  PracticeSessionType, 
  PracticeSessionSettings, 
  WordSelectionStrategy,
  LearningStatus,
  PracticeWordPerformance
} from '@vocabuddy/types';

@Injectable()
export class PracticeService {
  private readonly logger = new Logger(PracticeService.name);

  constructor(
    @InjectRepository(PracticeSession)
    private readonly practiceRepository: Repository<PracticeSession>,
    private readonly wordSelectionService: WordSelectionService,
  ) {}

  async startSession(
    userId: string,
    sessionType: PracticeSessionType,
    settings: PracticeSessionSettings,
  ): Promise<PracticeSession> {
    this.logger.debug(`Starting ${sessionType} session for user ${userId}`);
    
    // Select words based on session type and settings
    const selectedWords = await this.selectWordsForSession(userId, sessionType, settings);

    if (!selectedWords.length) {
      this.logger.warn(`No words available for practice session (user: ${userId}, type: ${sessionType})`);
      throw new BadRequestException('No words available for practice. Please add some words first.');
    }

    if (selectedWords.length < settings.wordsLimit) {
      this.logger.warn(`Not enough words available. Requested: ${settings.wordsLimit}, Available: ${selectedWords.length}`);
    }

    // Create new practice session
    const session = this.practiceRepository.create({
      userId,
      sessionType,
      settings,
      words: selectedWords.map(word => ({
        wordId: word.id,
        performance: PracticeWordPerformance.FAIR, // Default performance
        timeSpent: 0,
        attempts: 0,
        metadata: {},
      })),
      duration: 0,
      score: 0,
      results: {
        totalWords: selectedWords.length,
        correctWords: 0,
        incorrectWords: 0,
        accuracy: 0,
        averageTimePerWord: 0,
        streak: 0,
        xpEarned: 0,
      },
    });

    this.logger.debug(`Created practice session with ${selectedWords.length} words`);
    return this.practiceRepository.save(session);
  }

  async getAllSessions(userId: string): Promise<PracticeSession[]> {
    return this.practiceRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getSession(userId: string, sessionId: string): Promise<PracticeSession> {
    const session = await this.practiceRepository.findOne({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new NotFoundException('Practice session not found');
    }

    return session;
  }

  async updateSession(
    userId: string, 
    sessionId: string, 
    updateData: {
      duration?: number;
      score?: number;
      results?: {
        correctWords: number;
        incorrectWords: number;
        accuracy: number;
        averageTimePerWord: number;
        streak: number;
        xpEarned: number;
      };
    }
  ): Promise<PracticeSession> {
    const session = await this.getSession(userId, sessionId);
    
    // Update session data
    if (updateData.duration !== undefined) {
      session.duration = updateData.duration;
    }
    if (updateData.score !== undefined) {
      session.score = updateData.score;
    }
    if (updateData.results) {
      session.results = {
        ...session.results,
        ...updateData.results,
      };
    }

    return this.practiceRepository.save(session);
  }

  async recordWordPerformance(
    userId: string,
    sessionId: string,
    data: {
      wordId: string;
      performance: PracticeWordPerformance;
      timeSpent: number;
      attempts: number;
      metadata?: Record<string, any>;
    }
  ): Promise<PracticeSession> {
    const session = await this.getSession(userId, sessionId);
    
    // Find the word in the session
    const wordIndex = session.words.findIndex(w => w.wordId === data.wordId);
    if (wordIndex === -1) {
      throw new NotFoundException('Word not found in this practice session');
    }

    // Update word performance
    session.words[wordIndex] = {
      ...session.words[wordIndex],
      performance: data.performance,
      timeSpent: data.timeSpent,
      attempts: data.attempts,
      metadata: {
        ...session.words[wordIndex].metadata,
        ...data.metadata,
      },
    };

    // Update session statistics
    const totalTimeSpent = session.words.reduce((sum, word) => sum + word.timeSpent, 0);
    const correctWords = session.words.filter(w => 
      w.performance === PracticeWordPerformance.PERFECT || 
      w.performance === PracticeWordPerformance.GOOD
    ).length;

    session.results = {
      ...session.results,
      correctWords,
      incorrectWords: session.words.length - correctWords,
      accuracy: correctWords / session.words.length,
      averageTimePerWord: totalTimeSpent / session.words.length,
    };

    return this.practiceRepository.save(session);
  }

  async deleteSession(userId: string, sessionId: string): Promise<void> {
    const session = await this.getSession(userId, sessionId);
    await this.practiceRepository.remove(session);
  }

  private async selectWordsForSession(
    userId: string,
    sessionType: PracticeSessionType,
    settings: PracticeSessionSettings,
  ) {
    // Define selection strategy based on session type
    let strategy = WordSelectionStrategy.BALANCED;
    let includeRandomPercentage = 40;

    switch (sessionType) {
      case PracticeSessionType.FLASHCARD:
        strategy = WordSelectionStrategy.SPACED_REPETITION;
        includeRandomPercentage = 20; // Less random words for flashcards
        break;
      
      case PracticeSessionType.QUIZ:
        strategy = WordSelectionStrategy.BALANCED;
        includeRandomPercentage = 40; // Balanced mix for quizzes
        break;
      
      case PracticeSessionType.WRITING:
      case PracticeSessionType.SPEAKING:
        strategy = WordSelectionStrategy.WEAKEST_WORDS;
        includeRandomPercentage = 30; // Focus on weak words for active practice
        break;
      
      case PracticeSessionType.LISTENING:
        strategy = WordSelectionStrategy.MOST_ERRORS;
        includeRandomPercentage = 30; // Focus on problematic words for listening
        break;
    }

    // Select words using the word selection service
    const result = await this.wordSelectionService.selectWords({
      userId,
      count: settings.wordsLimit,
      strategy,
      includeRandomPercentage,
      filters: {
        // Accept any learning status initially
        status: Object.values(LearningStatus),
        // Adjust strength range based on difficulty, but be more lenient
        minStrength: settings.difficulty === 'easy' ? 0.2 : 0,
        maxStrength: settings.difficulty === 'hard' ? 0.8 : 1,
      },
      useCache: true,
    });

    // Combine and shuffle all selected words
    return [...result.algorithmicWords, ...result.randomWords]
      .sort(() => Math.random() - 0.5);
  }
} 