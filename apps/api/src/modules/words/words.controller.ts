import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { WordsService } from './words.service';
import { CreateWordDto, UpdateWordDto } from './dto/word.dto';
import { Word } from './entities/word.entity';
import { WordType, LearningStatus } from '@vocabuddy/types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('words')
@ApiBearerAuth('JWT-auth')
@Controller('words')
@UseGuards(JwtAuthGuard)
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new word' })
  @ApiResponse({ status: 201, description: 'Word created successfully', type: Word })
  @ApiBody({
    
    schema: {
      example: {
        word: "hello",
        userId: "123e4567-e89b-12d3-a456-426614174000",
        nativeLanguage: "Turkish",
        targetLanguages: [
            {
                name: "English",
                native: false,
            }
        ],
        learningStyle: "REPEAT",
        difficulty: "EASY",
        appLanguage: "English",
      }
    }
  })
  async create(
    @Body() createWordDto: CreateWordDto,
    @User('id') userId: string,
  ): Promise<Word> {
    return await this.wordsService.create(createWordDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all words for user' })
  @ApiResponse({
    status: 200,
    description: 'List of words',
    schema: {
      example: [{
        id: "123e4567-e89b-12d3-a456-426614174000",
        word: "hello",
        translation: "merhaba",
        wordType: "NOUN",
        examples: ["Hello, how are you?"],
        definition: "Used as a greeting",
        pronunciation: "həˈləʊ",
        difficulty: "BEGINNER",
        learning: {
          status: "NEW",
          lastReviewed: "2024-01-01T00:00:00Z",
          nextReview: "2024-01-02T00:00:00Z",
          confidence: 0,
          streak: 0
        },
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z"
      }]
    }
  })
  async findAll(@User('id') userId: string): Promise<Word[]> {
    return await this.wordsService.findAll(userId);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get words by type' })
  @ApiResponse({ status: 200, description: 'List of words by type', type: [Word] })
  async findByType(
    @Param('type') type: WordType,
    @User('id') userId: string,
  ): Promise<Word[]> {
    return await this.wordsService.findByType(type, userId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get words by learning status' })
  @ApiResponse({ status: 200, description: 'List of words by status', type: [Word] })
  @ApiResponse({ status: 404, description: 'No words found with this status' })
  @ApiBody({
    schema: {
      example: {
        status: "IN_PROGRESS"
      }
    }
  })
  async findByLearningStatus(
    @Param('status') status: LearningStatus,
    @User('id') userId: string,
  ): Promise<Word[]> {
    return await this.wordsService.findByLearningStatus(status, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a word by ID' })
  @ApiResponse({ status: 200, description: 'Word found', type: Word })
  @ApiResponse({ status: 404, description: 'Word not found' })
  async findOne(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<Word> {
    return await this.wordsService.findOne(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a word' })
  @ApiResponse({ status: 200, description: 'Word updated successfully', type: Word })
  @ApiBody({
    schema: {
      example: {
        translation: "merhaba",
        examples: ["Hello, how are you?", "Hello world!"],
        notes: "Common greeting in English"
      }
    }
  })
  async update(
    @Param('id') id: string,
    @Body() updateWordDto: UpdateWordDto,
    @User('id') userId: string,
  ): Promise<Word> {
    return await this.wordsService.update(id, updateWordDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a word' })
  @ApiResponse({ status: 200, description: 'Word deleted successfully' })
  async remove(
    @Param('id') id: string,
    @User('id') userId: string,
  ): Promise<void> {
    return await this.wordsService.remove(id, userId);
  }

  @Patch(':id/learning')
  @ApiOperation({ summary: 'Update word learning progress' })
  @ApiResponse({ status: 200, description: 'Learning progress updated', type: Word })
  @ApiBody({
    schema: {
      type: 'object',
      example: {
        status: "IN_PROGRESS",
        lastReviewed: new Date(),
        nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000),
        confidence: 0.8,
        streak: 3,
        notes: "Getting better at this word"
      }
    }
  })
  async updateLearningProgress(
    @Param('id') id: string,
    @Body() progress: Partial<Word['learning']>,
    @User('id') userId: string,
  ): Promise<Word> {
    return await this.wordsService.updateLearningProgress(id, userId, progress);
  }
} 