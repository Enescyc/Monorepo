import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from './entities/word.entity';
import { CreateWordDto, UpdateWordDto } from './dto/word.dto';
import { WordType, LearningStatus, Language, LearningStyle, ProficiencyLevel, PaginationParams, PaginatedResponse } from '@vocabuddy/types';
import OpenAI from 'openai';
import { OpenAIService } from '../ai/services/openai.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Word)
    @Inject() private readonly wordRepository: Repository<Word>,
    @Inject() private readonly openaiService: OpenAIService,
    @Inject() private readonly userService: UsersService,
  ) {}

  public async create(createWordDto: CreateWordDto, userId: string): Promise<Word> {
    const user : User = await this.userService.findOne(userId);
    if(!user) {
        throw new NotFoundException('User not found');
    }
  
    const generatedWord = await this.openaiService.generateWord({
        word: createWordDto.word,
        nativeLanguage: createWordDto.nativeLanguage,
        targetLanguages: createWordDto.targetLanguages,
        userId,
        learningStyles: createWordDto.learningStyle,
        difficulty: createWordDto.difficulty,
        appLanguage: user.appLanguage,
    });
    if(!generatedWord.word) {
        throw new BadRequestException('Failed to generate word');
    }

    return await this.wordRepository.save({
        ...generatedWord.word,  
        user,
    });
  }

  async findAll(userId: string): Promise<Word[]> {
    return await this.wordRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Word> {
    const word = await this.wordRepository.findOne({
      where: { id, userId },
    });
    if (!word) {
      throw new NotFoundException(`Word with ID ${id} not found`);
    }
    return word;
  }

  async update(id: string, updateWordDto: UpdateWordDto, userId: string): Promise<Word> {
    const word = await this.findOne(id, userId);
    Object.assign(word, updateWordDto);
    return await this.wordRepository.save(word);
  }

  async remove(id: string, userId: string): Promise<void> {
    const word = await this.findOne(id, userId);
    await this.wordRepository.remove(word);
  }

  async findByType(type: WordType, userId: string): Promise<Word[]> {
    return await this.wordRepository.find({
      where: {
        userId,
        wordType: type,
      },
    });
  }

  async findByLearningStatus(status: LearningStatus, userId: string): Promise<Word[]> {
    return await this.wordRepository.find({
      where: {
        userId,
        learning: {
          status,
        },
      },
    });
  }

  async updateLearningProgress(id: string, userId: string, progress: Partial<Word['learning']>): Promise<Word> {
    const word = await this.findOne(id, userId);
    word.learning = { ...word.learning, ...progress };
    return await this.wordRepository.save(word);
  }

  async findAllPaginated(userId: string, params: PaginationParams): Promise<PaginatedResponse<Word>> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = params;
    
    const queryBuilder = this.wordRepository.createQueryBuilder('word')
      .where('word.userId = :userId', { userId });

    if (search) {
      queryBuilder.andWhere('(word.word ILIKE :search OR word.translations::text ILIKE :search)', 
        { search: `%${search}%` });
    }

    const total = await queryBuilder.getCount();
    
    queryBuilder
      .orderBy(`word.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const words = await queryBuilder.getMany();
    const totalPages = Math.ceil(total / limit);

    return {
      data: words,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  }
} 