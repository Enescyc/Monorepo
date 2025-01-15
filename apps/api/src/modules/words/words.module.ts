import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './entities/word.entity';
import { PracticeSession } from '../practice/entities/practice.entity';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';
import { WordSelectionService } from './services/word-selection.service';
import { AIModule } from '../ai/ai.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Word, PracticeSession]),
    CacheModule.register({
      ttl: 300, // 5 minutes default TTL
      max: 100, // Maximum number of items in cache
    }),
    AIModule,
    UsersModule,
  ],
  controllers: [WordsController],
  providers: [WordsService, WordSelectionService],
  exports: [WordsService, WordSelectionService],
})
export class WordsModule {} 