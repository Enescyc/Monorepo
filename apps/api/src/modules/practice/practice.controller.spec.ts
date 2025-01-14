import { Test, TestingModule } from '@nestjs/testing';
import { PracticeController } from './practice.controller';
import { PracticeService } from './practice.service';
import { CreatePracticeSessionDto, UpdatePracticeSessionDto, RecordPracticeDto } from './dto/practice.dto';
import { PracticeSession } from './entities/practice.entity';
import { NotFoundException } from '@nestjs/common';
import { PracticeSessionType, PracticeWordPerformance, ReviewType, Difficulty } from '@vocabuddy/types';

// Mock the User decorator
jest.mock('../../common/decorators/user.decorator', () => ({
  User: () => (target: any, key: string, descriptor: PropertyDescriptor) => {
    return {
      value: (params: any) => params.user,
    };
  },
}));

describe('PracticeController', () => {
  let controller: PracticeController;
  let service: PracticeService;

  const userId = '1';

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

  const mockPracticeService = {
    createSession: jest.fn(),
    findAllSessions: jest.fn(),
    findSessionById: jest.fn(),
    updateSession: jest.fn(),
    removeSession: jest.fn(),
    recordWordPractice: jest.fn(),
    getWordPracticeHistory: jest.fn(),
    getUserPracticeStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PracticeController],
      providers: [
        {
          provide: PracticeService,
          useValue: mockPracticeService,
        },
      ],
    }).compile();

    controller = module.get<PracticeController>(PracticeController);
    service = module.get<PracticeService>(PracticeService);
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

      mockPracticeService.createSession.mockResolvedValue(mockSession);

      const result = await controller.createSession(createSessionDto, userId);

      expect(result).toEqual(mockSession);
      expect(service.createSession).toHaveBeenCalledWith(createSessionDto, userId);
    });
  });

  describe('findAllSessions', () => {
    it('should return an array of practice sessions', async () => {
      const sessions = [mockSession];
      mockPracticeService.findAllSessions.mockResolvedValue(sessions);

      const result = await controller.findAllSessions(userId);

      expect(result).toEqual(sessions);
      expect(service.findAllSessions).toHaveBeenCalledWith(userId);
    });
  });

  describe('findSessionById', () => {
    it('should return a practice session if found', async () => {
      mockPracticeService.findSessionById.mockResolvedValue(mockSession);

      const result = await controller.findSessionById('1', userId);

      expect(result).toEqual(mockSession);
      expect(service.findSessionById).toHaveBeenCalledWith('1', userId);
    });

    it('should throw NotFoundException if session is not found', async () => {
      mockPracticeService.findSessionById.mockRejectedValue(new NotFoundException());

      await expect(controller.findSessionById('1', userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateSession', () => {
    it('should update and return the session', async () => {
      const updateSessionDto: UpdatePracticeSessionDto = {
        score: 90,
        duration: 350,
      };
      const updatedSession = { ...mockSession, ...updateSessionDto };

      mockPracticeService.updateSession.mockResolvedValue(updatedSession);

      const result = await controller.updateSession('1', updateSessionDto, userId);

      expect(result).toEqual(updatedSession);
      expect(service.updateSession).toHaveBeenCalledWith('1', updateSessionDto, userId);
    });

    it('should throw NotFoundException if session is not found', async () => {
      mockPracticeService.updateSession.mockRejectedValue(new NotFoundException());

      await expect(controller.updateSession('1', {}, userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeSession', () => {
    it('should remove the session', async () => {
      mockPracticeService.removeSession.mockResolvedValue(undefined);

      await controller.removeSession('1', userId);

      expect(service.removeSession).toHaveBeenCalledWith('1', userId);
    });

    it('should throw NotFoundException if session is not found', async () => {
      mockPracticeService.removeSession.mockRejectedValue(new NotFoundException());

      await expect(controller.removeSession('1', userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('recordWordPractice', () => {
    it('should record word practice and update session', async () => {
      const recordPracticeDto: RecordPracticeDto = {
        timeSpent: 30,
        metadata: { notes: 'Good progress' },
      };
      const updatedSession = {
        ...mockSession,
        words: [
          {
            ...mockSession.words![0],
            timeSpent: recordPracticeDto.timeSpent,
            metadata: recordPracticeDto.metadata,
          },
        ],
      };

      mockPracticeService.recordWordPractice.mockResolvedValue(updatedSession);

      const result = await controller.recordWordPractice('1', '1', userId, recordPracticeDto);

      expect(result).toEqual(updatedSession);
      expect(service.recordWordPractice).toHaveBeenCalledWith(
        '1',
        '1',
        userId,
        PracticeWordPerformance.GOOD,
        recordPracticeDto.timeSpent,
        recordPracticeDto.metadata,
      );
    });
  });

  describe('getWordPracticeHistory', () => {
    it('should return practice history for a word', async () => {
      const history = [mockSession.words![0]];
      mockPracticeService.getWordPracticeHistory.mockResolvedValue(history);

      const result = await controller.getWordPracticeHistory('1', userId);

      expect(result).toEqual(history);
      expect(service.getWordPracticeHistory).toHaveBeenCalledWith('1', userId);
    });
  });

  describe('getUserPracticeStats', () => {
    it('should return user practice statistics', async () => {
      const stats = {
        totalSessions: 1,
        totalTimeSpent: mockSession.duration,
        averageScore: mockSession.score,
        practicesByType: {
          [PracticeSessionType.FLASHCARD]: 1,
        },
      };
      mockPracticeService.getUserPracticeStats.mockResolvedValue(stats);

      const result = await controller.getUserPracticeStats(userId);

      expect(result).toEqual(stats);
      expect(service.getUserPracticeStats).toHaveBeenCalledWith(userId);
    });
  });
}); 