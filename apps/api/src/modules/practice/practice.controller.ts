import { Controller, Post, Body, UseGuards, Get, Patch, Param, Delete } from '@nestjs/common';
import { PracticeService } from './services/practice.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PracticeSessionType, PracticeSessionSettings, PracticeWordPerformance } from '@vocabuddy/types';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

interface StartSessionDto {
  sessionType: PracticeSessionType;
  settings: PracticeSessionSettings;
}

interface UpdateSessionDto {
  duration?: number;
  score?: number;
  results?: {
    correctWords: number;
    incorrectWords: number;
    accuracy: number;
    averageTimePerWord: number;
    streak: number;
    xpEarned: number;
  };
}

interface RecordWordPerformanceDto {
  wordId: string;
  performance: PracticeWordPerformance;
  timeSpent: number;
  attempts: number;
  metadata?: Record<string, any>;
}

@ApiTags('practice')
@ApiBearerAuth('JWT-auth')
@Controller('practice')
@UseGuards(JwtAuthGuard)
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start a new practice session' })
  @ApiResponse({ 
    status: 201, 
    description: 'Practice session created successfully' 
  })
  @ApiBody({
    schema: {
      example: {
        sessionType: PracticeSessionType.FLASHCARD,
        settings: {
          difficulty: 'medium',
          reviewType: 'spaced',
          timeLimit: 300,
          wordsLimit: 10
        }
      }
    }
  })
  async startSession(
    @CurrentUser('id') userId: string,
    @Body() dto: StartSessionDto,
  ) {
    return this.practiceService.startSession(
      userId,
      dto.sessionType,
      dto.settings,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all practice sessions for the user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns all practice sessions' 
  })
  async getAllSessions(@CurrentUser('id') userId: string) {
    return this.practiceService.getAllSessions(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific practice session' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the practice session' 
  })
  async getSession(
    @CurrentUser('id') userId: string,
    @Param('id') sessionId: string,
  ) {
    return this.practiceService.getSession(userId, sessionId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a practice session' })
  @ApiResponse({ 
    status: 200, 
    description: 'Practice session updated successfully' 
  })
  @ApiBody({
    schema: {
      example: {
        duration: 280,
        score: 85,
        results: {
          correctWords: 8,
          incorrectWords: 2,
          accuracy: 0.8,
          averageTimePerWord: 28,
          streak: 5,
          xpEarned: 100
        }
      }
    }
  })
  async updateSession(
    @CurrentUser('id') userId: string,
    @Param('id') sessionId: string,
    @Body() dto: UpdateSessionDto,
  ) {
    return this.practiceService.updateSession(userId, sessionId, dto);
  }

  @Post(':id/words')
  @ApiOperation({ summary: 'Record performance for a word in the session' })
  @ApiResponse({ 
    status: 201, 
    description: 'Word performance recorded successfully' 
  })
  @ApiBody({
    schema: {
      example: {
        wordId: "uuid-of-word",
        performance: PracticeWordPerformance.GOOD,
        timeSpent: 15,
        attempts: 1,
        metadata: {
          mistakeType: "pronunciation",
          confidence: "high"
        }
      }
    }
  })
  async recordWordPerformance(
    @CurrentUser('id') userId: string,
    @Param('id') sessionId: string,
    @Body() dto: RecordWordPerformanceDto,
  ) {
    return this.practiceService.recordWordPerformance(
      userId,
      sessionId,
      dto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a practice session' })
  @ApiResponse({ 
    status: 200, 
    description: 'Practice session deleted successfully' 
  })
  async deleteSession(
    @CurrentUser('id') userId: string,
    @Param('id') sessionId: string,
  ) {
    return this.practiceService.deleteSession(userId, sessionId);
  }
} 