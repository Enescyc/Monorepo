import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from './entities/word.entity';
import { CreateWordDto, UpdateWordDto } from './dto/word.dto';
import { WordType, LearningStatus, Language, LearningStyle } from '@vocabuddy/types';
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
    const generatedWord = await this.openaiService.generateWord({
        word: createWordDto.word,
        nativeLanguage: user.languages.find(language => language.native)?.name as string,
        targetLanguages: user.languages.filter(language => !language.native).map(language => language.name) as string[],
        userId,
        learningStyles: user.settings.learningStyle,
        difficulty: user.settings.difficulty,
        appLanguage: user.languages.find(language => language.native)?.name as string,
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
} 