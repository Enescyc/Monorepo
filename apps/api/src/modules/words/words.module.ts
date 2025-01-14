import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from './entities/word.entity';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';
import { UsersModule } from '../users/users.module';
import { AIModule } from '../ai/ai.module';
import { OpenAIService } from '../ai/services/openai.service';
import { UsersService } from '../users/users.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([Word]),CacheModule.register(),AIModule,UsersModule],
  controllers: [WordsController],
  providers: [WordsService],
  exports: [WordsService],
})
export class WordsModule {} 