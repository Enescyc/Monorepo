import { Test, TestingModule } from '@nestjs/testing';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';
import { CreateWordDto, UpdateWordDto } from './dto/word.dto';
import { Word } from './entities/word.entity';
import { NotFoundException } from '@nestjs/common';
import { WordType, LearningStatus, LearningStyle, Difficulty } from '@vocabuddy/types';

// Mock the User decorator
jest.mock('../../common/decorators/user.decorator', () => ({
  User: () => (target: any, key: string, descriptor: PropertyDescriptor) => {
    return {
      value: (params: any) => params.user,
    };
  },
}));

describe('WordsController', () => {
  let controller: WordsController;
  let service: WordsService;

  const userId = '1';

  const mockWord: Partial<Word> = {
    id: '1',
    word: 'test',
    userId: '1',
    translations: [],
    pronunciation: 'test',
    wordType: [WordType.NOUN],
    definitions: [
      {
        partOfSpeech: 'noun',
        meaning: 'test meaning',
        examples: ['test example'],
      },
    ],
    examples: ['test example'],
    category: [],
    context: {} as any,
    etymology: {} as any,
    synonymsAntonyms: {} as any,
    learning: {} as any,
  };

  const mockWordsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByType: jest.fn(),
    findByLearningStatus: jest.fn(),
    updateLearningProgress: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WordsController],
      providers: [
        {
          provide: WordsService,
          useValue: mockWordsService,
        },
      ],
    }).compile();

    controller = module.get<WordsController>(WordsController);
    service = module.get<WordsService>(WordsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createWordDto: CreateWordDto = {
      word: 'test',
      userId: '1',
      nativeLanguage: 'English',
      targetLanguages: ['Spanish'],
      learningStyle: [LearningStyle.VISUAL],
      difficulty: Difficulty.EASY,
      appLanguage: 'English',
    };

    it('should create a new word', async () => {
      mockWordsService.create.mockResolvedValue(mockWord);

      const result = await controller.create(createWordDto, userId);

      expect(result).toEqual(mockWord);
      expect(service.create).toHaveBeenCalledWith(createWordDto, userId);
    });
  });

  describe('findAll', () => {
    it('should return an array of words', async () => {
      const words = [mockWord];
      mockWordsService.findAll.mockResolvedValue(words);

      const result = await controller.findAll(userId);

      expect(result).toEqual(words);
      expect(service.findAll).toHaveBeenCalledWith(userId);
    });
  });

  describe('findOne', () => {
    it('should return a word if found', async () => {
      mockWordsService.findOne.mockResolvedValue(mockWord);

      const result = await controller.findOne('1', userId);

      expect(result).toEqual(mockWord);
      expect(service.findOne).toHaveBeenCalledWith('1', userId);
    });

    it('should throw NotFoundException if word is not found', async () => {
      mockWordsService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('1', userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the word', async () => {
      const updateWordDto: UpdateWordDto = {
        word: 'updated',
      };
      const updatedWord = { ...mockWord, ...updateWordDto };

      mockWordsService.update.mockResolvedValue(updatedWord);

      const result = await controller.update('1', updateWordDto, userId);

      expect(result).toEqual(updatedWord);
      expect(service.update).toHaveBeenCalledWith('1', updateWordDto, userId);
    });

    it('should throw NotFoundException if word is not found', async () => {
      mockWordsService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update('1', {}, userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the word', async () => {
      mockWordsService.remove.mockResolvedValue(undefined);

      await controller.remove('1', userId);

      expect(service.remove).toHaveBeenCalledWith('1', userId);
    });

    it('should throw NotFoundException if word is not found', async () => {
      mockWordsService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('1', userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByType', () => {
    it('should return words of specified type', async () => {
      const words = [mockWord];
      mockWordsService.findByType.mockResolvedValue(words);

      const result = await controller.findByType(WordType.NOUN, userId);

      expect(result).toEqual(words);
      expect(service.findByType).toHaveBeenCalledWith(WordType.NOUN, userId);
    });
  });

  describe('findByLearningStatus', () => {
    it('should return words with specified learning status', async () => {
      const words = [mockWord];
      mockWordsService.findByLearningStatus.mockResolvedValue(words);

      const result = await controller.findByLearningStatus(LearningStatus.NEW, userId);

      expect(result).toEqual(words);
      expect(service.findByLearningStatus).toHaveBeenCalledWith(LearningStatus.NEW, userId);
    });
  });

  describe('updateLearningProgress', () => {
    it('should update learning progress of a word', async () => {
      const progress = { status: LearningStatus.LEARNING };
      const updatedWord = { ...mockWord, learning: progress };

      mockWordsService.updateLearningProgress.mockResolvedValue(updatedWord);

      const result = await controller.updateLearningProgress('1', progress, userId);

      expect(result).toEqual(updatedWord);
      expect(service.updateLearningProgress).toHaveBeenCalledWith('1', userId, progress);
    });

    it('should throw NotFoundException if word is not found', async () => {
      mockWordsService.updateLearningProgress.mockRejectedValue(new NotFoundException());

      await expect(
        controller.updateLearningProgress('1', { status: LearningStatus.LEARNING }, userId),
      ).rejects.toThrow(NotFoundException);
    });
  });
}); 