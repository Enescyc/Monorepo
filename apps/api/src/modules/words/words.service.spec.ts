import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WordsService } from './words.service';
import { Word } from './entities/word.entity';
import { CreateWordDto, UpdateWordDto } from './dto/word.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OpenAIService } from '../ai/services/openai.service';
import { UsersService } from '../users/users.service';
import { WordType, LearningStatus, LearningStyle, Difficulty, ProficiencyLevel } from '@vocabuddy/types';

describe('WordsService', () => {
  let service: WordsService;
  let repository: Repository<Word>;
  let openaiService: OpenAIService;
  let usersService: UsersService;

  const mockUser = {
    id: '1',
    languages: [
      { name: 'English', native: true },
      { name: 'Spanish', native: false },
    ],
    settings: {
      learningStyle: [LearningStyle.VISUAL],
      difficulty: Difficulty.EASY,
    },
  };

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

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockOpenAIService = {
    generateWord: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WordsService,
        {
          provide: getRepositoryToken(Word),
          useValue: mockRepository,
        },
        {
          provide: OpenAIService,
          useValue: mockOpenAIService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<WordsService>(WordsService);
    repository = module.get<Repository<Word>>(getRepositoryToken(Word));
    openaiService = module.get<OpenAIService>(OpenAIService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createWordDto: CreateWordDto = {
      word: 'test',
      userId: '1',
      nativeLanguage: 'English',
      targetLanguages: [
        {
          name: 'English',
          code: 'en',
          native: false,
          proficiency: ProficiencyLevel.A1,
          startedAt: new Date(),
          lastStudied: new Date(),
        }
      ],
      learningStyle: [LearningStyle.VISUAL],
      difficulty: Difficulty.EASY,
      appLanguage: 'English',
    };

    it('should create a new word', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockOpenAIService.generateWord.mockResolvedValue({ word: mockWord });
      mockRepository.save.mockResolvedValue(mockWord);

      const result = await service.create(createWordDto, '1');

      expect(result).toEqual(mockWord);
      expect(mockOpenAIService.generateWord).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if word generation fails', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockOpenAIService.generateWord.mockResolvedValue({ word: null });

      await expect(service.create(createWordDto, '1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of words', async () => {
      const words = [mockWord];
      mockRepository.find.mockResolvedValue(words);

      const result = await service.findAll('1');

      expect(result).toEqual(words);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: '1' },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a word if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockWord);

      const result = await service.findOne('1', '1');

      expect(result).toEqual(mockWord);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', userId: '1' },
      });
    });

    it('should throw NotFoundException if word is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1', '1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the word', async () => {
      const updateWordDto: UpdateWordDto = {
        word: 'updated',
      };
      const updatedWord = { ...mockWord, ...updateWordDto };

      mockRepository.findOne.mockResolvedValue(mockWord);
      mockRepository.save.mockResolvedValue(updatedWord);

      const result = await service.update('1', updateWordDto, '1');

      expect(result).toEqual(updatedWord);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedWord);
    });

    it('should throw NotFoundException if word is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('1', {}, '1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the word', async () => {
      mockRepository.findOne.mockResolvedValue(mockWord);

      await service.remove('1', '1');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockWord);
    });

    it('should throw NotFoundException if word is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('1', '1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByType', () => {
    it('should return words of specified type', async () => {
      const words = [mockWord];
      mockRepository.find.mockResolvedValue(words);

      const result = await service.findByType(WordType.NOUN, '1');

      expect(result).toEqual(words);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          userId: '1',
          wordType: WordType.NOUN,
        },
      });
    });
  });

  describe('findByLearningStatus', () => {
    it('should return words with specified learning status', async () => {
      const words = [mockWord];
      mockRepository.find.mockResolvedValue(words);

      const result = await service.findByLearningStatus(LearningStatus.NEW, '1');

      expect(result).toEqual(words);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          userId: '1',
          learning: {
            status: LearningStatus.NEW,
          },
        },
      });
    });
  });

  describe('updateLearningProgress', () => {
    it('should update learning progress of a word', async () => {
      const progress = { status: LearningStatus.LEARNING };
      const updatedWord = { ...mockWord, learning: progress };

      mockRepository.findOne.mockResolvedValue(mockWord);
      mockRepository.save.mockResolvedValue(updatedWord);

      const result = await service.updateLearningProgress('1', '1', progress);

      expect(result).toEqual(updatedWord);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedWord);
    });

    it('should throw NotFoundException if word is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateLearningProgress('1', '1', { status: LearningStatus.LEARNING }),
      ).rejects.toThrow(NotFoundException);
    });
  });
}); 