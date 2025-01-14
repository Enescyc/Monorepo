import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import OpenAI from 'openai';
import { OpenAIService } from './openai.service';
import {
  AIModel,
  AIVoice,
  LearningStatus,
  LearningStyle,
  Difficulty,
  WordType,
} from '@vocabuddy/types';

jest.mock('openai');

describe('OpenAIService', () => {
  let service: OpenAIService;
  let configService: ConfigService;
  let cacheManager: Cache;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const mockOpenAIResponse = {
    choices: [
      {
        message: {
          content: 'Test response',
        },
      },
    ],
    usage: {
      prompt_tokens: 10,
      completion_tokens: 20,
      total_tokens: 30,
    },
    model: 'gpt-3.5-turbo',
  };

  const mockOpenAIClient = {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
    audio: {
      speech: {
        create: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenAIService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<OpenAIService>(OpenAIService);
    configService = module.get<ConfigService>(ConfigService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);

    // Mock OpenAI configuration
    mockConfigService.get.mockImplementation((key: string) => {
      switch (key) {
        case 'OPENAI_API_KEY':
          return 'test-api-key';
        case 'OPENAI_MODEL':
          return AIModel.GPT4;
        case 'OPENAI_TEMPERATURE':
          return 0.7;
        case 'OPENAI_MAX_TOKENS':
          return 2000;
        default:
          return undefined;
      }
    });

    // Initialize OpenAI client
    (OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => mockOpenAIClient as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should initialize OpenAI client with correct configuration', () => {
      service.onModuleInit();

      expect(OpenAI).toHaveBeenCalledWith({
        apiKey: 'test-api-key',
      });
    });

    it('should throw error if API key is not defined', () => {
      mockConfigService.get.mockReturnValue(undefined);

      expect(() => service.onModuleInit()).toThrow('OPENAI_API_KEY is not defined');
    });
  });

  describe('generateText', () => {
    const prompt = 'Test prompt';

    beforeEach(() => {
      service.onModuleInit();
    });

    it('should return cached response if available', async () => {
      const cachedResponse = {
        content: 'Cached response',
        usage: { promptTokens: 5, completionTokens: 10, totalTokens: 15 },
        model: AIModel.GPT4,
      };

      mockCacheManager.get.mockResolvedValue(cachedResponse);

      const result = await service.generateText(prompt);

      expect(result).toEqual(cachedResponse);
      expect(mockOpenAIClient.chat.completions.create).not.toHaveBeenCalled();
    });

    it('should generate new response if cache is empty', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockOpenAIClient.chat.completions.create.mockResolvedValue(mockOpenAIResponse);

      const result = await service.generateText(prompt);

      expect(result).toEqual({
        content: mockOpenAIResponse.choices[0].message.content,
        usage: {
          promptTokens: mockOpenAIResponse.usage.prompt_tokens,
          completionTokens: mockOpenAIResponse.usage.completion_tokens,
          totalTokens: mockOpenAIResponse.usage.total_tokens,
        },
        model: mockOpenAIResponse.model,
      });
      expect(mockCacheManager.set).toHaveBeenCalled();
    });
  });

  describe('generateWord', () => {
    const wordContext = {
      word: 'test',
      userId: '1',
      appLanguage: 'en',
      targetLanguages: ['es'],
      nativeLanguage: 'en',
      learningStyles: [LearningStyle.VISUAL],
      difficulty: Difficulty.EASY,
    };

    const mockWordData = {
      translations: [{ language: 'es', translation: 'prueba' }],
      pronunciation: 'test',
      wordType: [WordType.NOUN],
      definitions: [{ partOfSpeech: 'noun', meaning: 'test', examples: ['test example'] }],
      examples: ['test example'],
      category: [{ name: 'General', description: 'Common words' }],
      context: {
        sentences: ['Test sentence'],
        usageNotes: 'Test notes',
        difficulty: 'easy',
        tags: ['common'],
        tips: ['Test tip'],
      },
      etymology: {
        origin: 'Old English',
        history: 'Test history',
      },
      synonymsAntonyms: {
        synonyms: ['exam'],
        antonyms: ['real'],
      },
    };

    beforeEach(() => {
      service.onModuleInit();
    });

    it('should return cached word response if available', async () => {
      const cachedResponse = {
        content: JSON.stringify(mockWordData),
        usage: { promptTokens: 5, completionTokens: 10, totalTokens: 15 },
        model: AIModel.GPT4,
        word: {
          ...mockWordData,
          word: wordContext.word,
          userId: wordContext.userId,
          learning: {
            status: LearningStatus.NEW,
            strength: 0,
            nextReview: expect.any(Date),
            lastStudied: expect.any(Date),
          },
          createdAt: expect.any(Number),
          updatedAt: expect.any(Number),
        },
      };

      mockCacheManager.get.mockResolvedValue(cachedResponse);

      const result = await service.generateWord(wordContext);

      expect(result).toEqual(cachedResponse);
      expect(mockOpenAIClient.chat.completions.create).not.toHaveBeenCalled();
    });

    it('should generate new word data if cache is empty', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockOpenAIClient.chat.completions.create.mockResolvedValue({
        ...mockOpenAIResponse,
        choices: [{ message: { content: JSON.stringify(mockWordData) } }],
      });

      const result = await service.generateWord(wordContext);

      expect(result.word).toMatchObject({
        ...mockWordData,
        word: wordContext.word,
        userId: wordContext.userId,
        learning: {
          status: LearningStatus.NEW,
          strength: 0,
          nextReview: expect.any(Date),
          lastStudied: expect.any(Date),
        },
      });
      expect(mockCacheManager.set).toHaveBeenCalled();
    });

    it('should throw error if AI response cannot be parsed', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockOpenAIClient.chat.completions.create.mockResolvedValue({
        ...mockOpenAIResponse,
        choices: [{ message: { content: 'invalid json' } }],
      });

      await expect(service.generateWord(wordContext)).rejects.toThrow('Failed to parse AI response');
    });
  });

  describe('generateSpeech', () => {
    const text = 'Test text';
    const options = { voice: AIVoice.ALLOY };

    beforeEach(() => {
      service.onModuleInit();
    });

    it('should return cached speech if available', async () => {
      const cachedResponse = Buffer.from('cached audio');
      mockCacheManager.get.mockResolvedValue(cachedResponse);

      const result = await service.generateSpeech(text, options);

      expect(result).toEqual(cachedResponse);
      expect(mockOpenAIClient.audio.speech.create).not.toHaveBeenCalled();
    });

    it('should generate new speech if cache is empty', async () => {
      const mockAudioBuffer = Buffer.from('test audio');
      mockCacheManager.get.mockResolvedValue(null);
      mockOpenAIClient.audio.speech.create.mockResolvedValue({
        arrayBuffer: () => Promise.resolve(mockAudioBuffer),
      });

      const result = await service.generateSpeech(text, options);

      expect(result).toEqual(mockAudioBuffer);
      expect(mockOpenAIClient.audio.speech.create).toHaveBeenCalledWith({
        model: AIModel.TTS,
        voice: AIVoice.ALLOY,
        input: text,
      });
      expect(mockCacheManager.set).toHaveBeenCalled();
    });
  });

  describe('compareSpeech', () => {
    it('should return placeholder comparison result', async () => {
      const result = await service.compareSpeech(Buffer.from('original'), Buffer.from('user'));

      expect(result).toEqual({
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
      });
    });
  });
}); 