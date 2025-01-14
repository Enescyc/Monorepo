import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PracticeService } from './practice.service';
import { CreatePracticeSessionDto, UpdatePracticeSessionDto, RecordPracticeDto } from './dto/practice.dto';
import { PracticeSession } from './entities/practice.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { PracticeWordPerformance } from '@vocabuddy/types';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('practice')
@ApiBearerAuth('JWT-auth')
@Controller('practice')
@UseGuards(JwtAuthGuard)
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post('sessions')
  @ApiOperation({ summary: 'Create a new practice session' })
  @ApiResponse({ status: 201, description: 'Practice session created', type: PracticeSession })
  @ApiBody({
    type: CreatePracticeSessionDto,
    examples: {
      session: {
        value: {
          words: [
            {
              id: "word-uuid",
              word: "example",
              status: "NEW"
            }
          ],
          sessionType: "FLASHCARD",
          duration: 300,
          score: 0,
          settings: {
            reviewType: "SPACED",
            difficulty: "MEDIUM",
            timeLimit: 300
          },
          results: {
            completed: false,
            correctAnswers: 0,
            wrongAnswers: 0
          }
        }
      }
    }
  })
  async createSession(
    @Body() createPracticeSessionDto: CreatePracticeSessionDto,
    @User('id') userId: string,
  ): Promise<PracticeSession> {
    return await this.practiceService.createSession(createPracticeSessionDto, userId);
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Get all practice sessions' })
  @ApiResponse({ status: 200, description: 'List of practice sessions', type: [PracticeSession] })
  async findAllSessions(@User('id') userId: string): Promise<PracticeSession[]> {
    return await this.practiceService.findAllSessions(userId);
  }

  @Get('sessions/:id')
  @ApiOperation({ summary: 'Get practice session by ID' })
  @ApiResponse({ status: 200, description: 'Practice session found', type: PracticeSession })
  @ApiResponse({ status: 404, description: 'Practice session not found' })
  async findSessionById(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<PracticeSession> {
    return await this.practiceService.findSessionById(id, userId);
  }

  @Patch('sessions/:id')
  @ApiOperation({ summary: 'Update practice session' })
  @ApiResponse({ status: 200, description: 'Practice session updated', type: PracticeSession })
  @ApiBody({
    type: UpdatePracticeSessionDto,
    examples: {
      update: {
        value: {
          duration: 450,
          score: 85,
          results: {
            completed: true,
            correctAnswers: 8,
            wrongAnswers: 2
          }
        }
      }
    }
  })
  async updateSession(
    @Param('id') id: string,
    @Body() updatePracticeSessionDto: UpdatePracticeSessionDto,
    @User('id') userId: string,
  ): Promise<PracticeSession> {
    return await this.practiceService.updateSession(id, updatePracticeSessionDto, userId);
  }

  @Delete('sessions/:id')
  @ApiOperation({ summary: 'Delete practice session' })
  @ApiResponse({ status: 200, description: 'Practice session deleted' })
  async removeSession(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<void> {
    return await this.practiceService.removeSession(id, userId);
  }

  @Post('sessions/:sessionId/words/:wordId/practice')
  @ApiOperation({ summary: 'Record word practice in a session' })
  @ApiResponse({ status: 201, description: 'Practice recorded', type: PracticeSession })
  @ApiBody({
    type: RecordPracticeDto,
    examples: {
      practice: {
        value: {
          timeSpent: 60,
          metadata: {
            attemptCount: 1,
            confidence: "HIGH",
            mistakes: []
          }
        }
      }
    }
  })
  async recordWordPractice(
    @Param('sessionId') sessionId: string,
    @Param('wordId') wordId: string,
    @User('id') userId: string,
    @Body() recordPracticeDto: RecordPracticeDto,
  ): Promise<PracticeSession> {
    return await this.practiceService.recordWordPractice(
      sessionId,
      wordId,
      userId,
      PracticeWordPerformance.GOOD,
      recordPracticeDto.timeSpent,
      recordPracticeDto.metadata,
    );
  }

  @Get('sessions/:sessionId/words/:wordId/history')
  @ApiOperation({ summary: 'Get word practice history' })
  @ApiResponse({ status: 200, description: 'Practice history' })
  async getWordPracticeHistory(
    @Param('wordId') wordId: string,
    @User('id') userId: string,
  ): Promise<any[]> {
    return await this.practiceService.getWordPracticeHistory(wordId, userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user practice statistics' })
  @ApiResponse({
    status: 200,
    description: 'Practice statistics',
    schema: {
      type: 'object',
      example: {
        totalSessions: 10,
        totalTimeSpent: 3600,
        averageScore: 85.5,
        practicesByType: {
          FLASHCARD: 5,
          QUIZ: 3,
          WRITING: 2
        }
      }
    }
  })
  async getUserPracticeStats(@User('id') userId: string): Promise<{
    totalSessions: number;
    totalTimeSpent: number;
    averageScore: number;
    practicesByType: Record<string, number>;
  }> {
    return await this.practiceService.getUserPracticeStats(userId);
  }
} 