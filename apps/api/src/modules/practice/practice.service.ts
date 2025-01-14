import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PracticeSession } from './entities/practice.entity';
import { WordsService } from '../words/words.service';
import { CreatePracticeSessionDto, UpdatePracticeSessionDto } from './dto/practice.dto';
import { PracticeSessionType, PracticeWordPerformance, PracticeWord } from '@vocabuddy/types';

@Injectable()
export class PracticeService {
  constructor(
    @InjectRepository(PracticeSession)
    private readonly sessionRepository: Repository<PracticeSession>,
    private readonly wordsService: WordsService,
  ) {}

  async createSession(
    createPracticeSessionDto: CreatePracticeSessionDto,
    userId: string,
  ): Promise<PracticeSession> {
    const session = this.sessionRepository.create({
      ...createPracticeSessionDto,
      userId,
    });
    return await this.sessionRepository.save(session);
  }

  async findAllSessions(userId: string): Promise<PracticeSession[]> {
    return await this.sessionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findSessionById(id: string, userId: string): Promise<PracticeSession> {
    const session = await this.sessionRepository.findOne({
      where: { id, userId },
    });
    if (!session) {
      throw new NotFoundException(`Practice session with ID ${id} not found`);
    }
    return session;
  }

  async updateSession(
    id: string,
    updatePracticeSessionDto: UpdatePracticeSessionDto,
    userId: string,
  ): Promise<PracticeSession> {
    const session = await this.findSessionById(id, userId);
    Object.assign(session, updatePracticeSessionDto);
    return await this.sessionRepository.save(session);
  }

  async removeSession(id: string, userId: string): Promise<void> {
    const session = await this.findSessionById(id, userId);
    await this.sessionRepository.remove(session);
  }

  async recordWordPractice(
    sessionId: string,
    wordId: string,
    userId: string,
    performance: PracticeWordPerformance,
    timeSpent: number,
    metadata?: Record<string, any>,
  ): Promise<PracticeSession> {
    const session = await this.findSessionById(sessionId, userId);
    const word = await this.wordsService.findOne(wordId, userId);
    
    const wordIndex = session.words.findIndex(w => w.wordId === wordId);
    if (wordIndex === -1) {
      throw new NotFoundException(`Word with ID ${wordId} not found in session`);
    }

    session.words[wordIndex] = {
      ...session.words[wordIndex],
      performance,
      timeSpent,
      metadata: metadata || {},
      attempts: (session.words[wordIndex].attempts || 0) + 1
    } as PracticeWord;

    return await this.sessionRepository.save(session);
  }

  async getWordPracticeHistory(wordId: string, userId: string): Promise<PracticeWord[]> {
    const sessions = await this.sessionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return sessions
      .map(session => session.words.find(w => w.wordId === wordId))
      .filter((word): word is PracticeWord => word !== undefined);
  }

  async getUserPracticeStats(userId: string): Promise<{
    totalSessions: number;
    totalTimeSpent: number;
    averageScore: number;
    practicesByType: Record<PracticeSessionType, number>;
  }> {
    const sessions = await this.sessionRepository.find({
      where: { userId },
    });

    const practicesByType = sessions.reduce((acc, session) => {
      acc[session.sessionType] = (acc[session.sessionType] || 0) + 1;
      return acc;
    }, {} as Record<PracticeSessionType, number>);

    const totalTimeSpent = sessions.reduce((sum, session) => sum + session.duration, 0);
    const averageScore = sessions.reduce((sum, session) => sum + session.score, 0) / sessions.length || 0;

    return {
      totalSessions: sessions.length,
      totalTimeSpent,
      averageScore,
      practicesByType,
    };
  }
} 