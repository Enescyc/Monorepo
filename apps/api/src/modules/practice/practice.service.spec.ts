import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PracticeService } from './practice.service';
import { PracticeSession } from './entities/practice.entity';
import { WordsService } from '../words/words.service';
import { CreatePracticeSessionDto, UpdatePracticeSessionDto } from './dto/practice.dto';
import { NotFoundException } from '@nestjs/common';
import { PracticeSessionType, PracticeWordPerformance, ReviewType, Difficulty } from '@vocabuddy/types';

describe('PracticeService', () => {
  let service: PracticeService;
  let repository: Repository<PracticeSession>;
  let wordsService: WordsService;

  const mockSession: Partial<PracticeSession> = {
    id: '1',
    userId: '1',
    words: [
      {
        wordId: '1',
        performance: PracticeWordPerformance.GOOD,
        timeSpent: 30,
        attempts: 1,
        metadata: {},
      },
    ],
    sessionType: PracticeSessionType.FLASHCARD,
    duration: 300,
    score: 85,
    settings: {
      reviewType: ReviewType.SPACED,
      difficulty: Difficulty.MEDIUM,
      timeLimit: 300,
      wordsLimit: 10,
    },
    results: {
      totalWords: 10,
      correctWords: 8,
      incorrectWords: 2,
      accuracy: 0.8,
      averageTimePerWord: 30,
      streak: 3,
      xpEarned: 100,
    },
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockWordsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PracticeService,
        {
          provide: getRepositoryToken(PracticeSession),
          useValue: mockRepository,
        },
        {
          provide: WordsService,
          useValue: mockWordsService,
        },
      ],
    }).compile();

    service = module.get<PracticeService>(PracticeService);
    repository = module.get<Repository<PracticeSession>>(getRepositoryToken(PracticeSession));
    wordsService = module.get<WordsService>(WordsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createSession', () => {
    it('should create a new practice session', async () => {
      const createSessionDto: CreatePracticeSessionDto = {
        words: mockSession.words!,
        sessionType: mockSession.sessionType!,
        duration: mockSession.duration!,
        score: mockSession.score!,
        settings: mockSession.settings!,
        results: mockSession.results!,
      };

      mockRepository.create.mockReturnValue(mockSession);
      mockRepository.save.mockResolvedValue(mockSession);

      const result = await service.createSession(createSessionDto, '1');

      expect(result).toEqual(mockSession);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createSessionDto,
        userId: '1',
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockSession);
    });
  });

  describe('findAllSessions', () => {
    it('should return an array of practice sessions', async () => {
      const sessions = [mockSession];
      mockRepository.find.mockResolvedValue(sessions);

      const result = await service.findAllSessions('1');

      expect(result).toEqual(sessions);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: '1' },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findSessionById', () => {
    it('should return a practice session if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockSession);

      const result = await service.findSessionById('1', '1');

      expect(result).toEqual(mockSession);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', userId: '1' },
      });
    });

    it('should throw NotFoundException if session is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findSessionById('1', '1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateSession', () => {
    it('should update and return the session', async () => {
      const updateSessionDto: UpdatePracticeSessionDto = {
        score: 90,
        duration: 350,
      };
      const updatedSession = { ...mockSession, ...updateSessionDto };

      mockRepository.findOne.mockResolvedValue(mockSession);
      mockRepository.save.mockResolvedValue(updatedSession);

      const result = await service.updateSession('1', updateSessionDto, '1');

      expect(result).toEqual(updatedSession);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedSession);
    });

    it('should throw NotFoundException if session is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.updateSession('1', {}, '1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeSession', () => {
    it('should remove the session', async () => {
      mockRepository.findOne.mockResolvedValue(mockSession);

      await service.removeSession('1', '1');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockSession);
    });

    it('should throw NotFoundException if session is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.removeSession('1', '1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('recordWordPractice', () => {
    it('should record word practice and update session', async () => {
      const wordId = '1';
      const performance = PracticeWordPerformance.GOOD;
      const timeSpent = 30;
      const metadata = { notes: 'Good progress' };

      mockRepository.findOne.mockResolvedValue(mockSession);
      mockWordsService.findOne.mockResolvedValue({ id: wordId });
      mockRepository.save.mockResolvedValue({
        ...mockSession,
        words: [
          {
            ...mockSession.words![0],
            performance,
            timeSpent,
            metadata,
            attempts: 2,
          },
        ],
      });

      const result = await service.recordWordPractice('1', wordId, '1', performance, timeSpent, metadata);

      expect(result.words![0]).toMatchObject({
        performance,
        timeSpent,
        metadata,
        attempts: 2,
      });
    });

    it('should throw NotFoundException if word is not found in session', async () => {
      mockRepository.findOne.mockResolvedValue(mockSession);
      mockWordsService.findOne.mockResolvedValue({ id: '2' });

      await expect(
        service.recordWordPractice('1', '2', '1', PracticeWordPerformance.GOOD, 30),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getWordPracticeHistory', () => {
    it('should return practice history for a word', async () => {
      const sessions = [mockSession];
      mockRepository.find.mockResolvedValue(sessions);

      const result = await service.getWordPracticeHistory('1', '1');

      expect(result).toEqual([mockSession.words![0]]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: '1' },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('getUserPracticeStats', () => {
    it('should return user practice statistics', async () => {
      const sessions = [mockSession];
      mockRepository.find.mockResolvedValue(sessions);

      const result = await service.getUserPracticeStats('1');

      expect(result).toEqual({
        totalSessions: 1,
        totalTimeSpent: mockSession.duration,
        averageScore: mockSession.score,
        practicesByType: {
          [PracticeSessionType.FLASHCARD]: 1,
        },
      });
    });

    it('should handle empty sessions', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.getUserPracticeStats('1');

      expect(result).toEqual({
        totalSessions: 0,
        totalTimeSpent: 0,
        averageScore: 0,
        practicesByType: {},
      });
    });
  });
}); 