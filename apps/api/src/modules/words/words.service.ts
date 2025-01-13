import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from './entities/word.entity';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { LearningStatus } from '@vocabuddy/types';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Word)
    private readonly wordsRepository: Repository<Word>,
  ) {}

  async create(userId: string, createWordDto: CreateWordDto): Promise<Word> {
    const word = this.wordsRepository.create({
      ...createWordDto,
      userId,
      status: createWordDto.status || LearningStatus.NEW,
      practiceCount: 0,
      masteryLevel: 0,
    });
    return await this.wordsRepository.save(word);
  }

  async findAll(userId: string): Promise<Word[]> {
    return await this.wordsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Word> {
    const word = await this.wordsRepository.findOne({
      where: { id, userId },
    });
    if (!word) {
      throw new NotFoundException(`Word with ID "${id}" not found`);
    }
    return word;
  }

  async update(userId: string, id: string, updateWordDto: UpdateWordDto): Promise<Word> {
    const word = await this.findOne(userId, id);
    Object.assign(word, updateWordDto);
    return await this.wordsRepository.save(word);
  }

  async remove(userId: string, id: string): Promise<void> {
    const word = await this.findOne(userId, id);
    await this.wordsRepository.remove(word);
  }

  async updateWordStatus(userId: string, id: string, status: LearningStatus): Promise<Word> {
    const word = await this.findOne(userId, id);
    word.status = status;
    word.lastPracticedAt = new Date();
    word.practiceCount += 1;
    return await this.wordsRepository.save(word);
  }

  async updateMasteryLevel(userId: string, id: string, score: number): Promise<Word> {
    const word = await this.findOne(userId, id);
    word.masteryLevel = Math.min(Math.max(word.masteryLevel + score, 0), 1);
    word.lastPracticedAt = new Date();
    word.practiceCount += 1;

    if (word.masteryLevel >= 0.8) {
      word.status = LearningStatus.MASTERED;
    } else if (word.masteryLevel >= 0.3) {
      word.status = LearningStatus.LEARNING;
    }

    return await this.wordsRepository.save(word);
  }

  async findByStatus(userId: string, status: LearningStatus): Promise<Word[]> {
    return await this.wordsRepository.find({
      where: { userId, status },
      order: { lastPracticedAt: 'ASC' },
    });
  }
} 