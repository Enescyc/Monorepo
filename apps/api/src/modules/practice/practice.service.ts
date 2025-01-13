import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Practice, PracticeType } from './entities/practice.entity';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { WordsService } from '../words/words.service';

@Injectable()
export class PracticeService {
  constructor(
    @InjectRepository(Practice)
    private readonly practiceRepository: Repository<Practice>,
    private readonly wordsService: WordsService,
  ) {}

  async create(userId: string, createPracticeDto: CreatePracticeDto): Promise<Practice> {
    // Verify word exists and belongs to user
    await this.wordsService.findOne(userId, createPracticeDto.wordId);

    const practice = this.practiceRepository.create({
      ...createPracticeDto,
      userId,
      completedAt: new Date(),
    });

    const savedPractice = await this.practiceRepository.save(practice);

    // Update word mastery level based on practice result
    await this.wordsService.updateMasteryLevel(
      userId,
      createPracticeDto.wordId,
      createPracticeDto.score,
    );

    return savedPractice;
  }

  async findAll(userId: string): Promise<Practice[]> {
    return await this.practiceRepository.find({
      where: { userId },
      order: { completedAt: 'DESC' },
      relations: ['word'],
    });
  }

  async findByWord(userId: string, wordId: string): Promise<Practice[]> {
    return await this.practiceRepository.find({
      where: { userId, wordId },
      order: { completedAt: 'DESC' },
    });
  }

  async getStatistics(userId: string) {
    const practices = await this.practiceRepository.find({
      where: { userId },
      relations: ['word'],
    });

    return {
      totalPractices: practices.length,
      byType: this.groupByType(practices),
      averageScore: this.calculateAverageScore(practices),
      practiceStreak: this.calculateStreak(practices),
      recentActivity: this.getRecentActivity(practices),
    };
  }

  private groupByType(practices: Practice[]) {
    return practices.reduce((acc, practice) => {
      acc[practice.type] = (acc[practice.type] || 0) + 1;
      return acc;
    }, {} as Record<PracticeType, number>);
  }

  private calculateAverageScore(practices: Practice[]) {
    if (practices.length === 0) return 0;
    const totalScore = practices.reduce((sum, practice) => sum + practice.score, 0);
    return totalScore / practices.length;
  }

  private calculateStreak(practices: Practice[]) {
    if (practices.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = today;

    while (true) {
      const practicesOnDate = practices.some(practice => {
        const practiceDate = new Date(practice.completedAt);
        practiceDate.setHours(0, 0, 0, 0);
        return practiceDate.getTime() === currentDate.getTime();
      });

      if (!practicesOnDate) break;
      
      streak += 1;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }

  private getRecentActivity(practices: Practice[]) {
    return practices
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
      .slice(0, 10);
  }
} 