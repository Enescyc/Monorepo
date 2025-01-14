import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PracticeService } from './practice.service';
import { PracticeController } from './practice.controller';
import { PracticeSession } from './entities/practice.entity';
import { WordsModule } from '../words/words.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PracticeSession]),
    WordsModule
  ],
  controllers: [PracticeController],
  providers: [PracticeService],
  exports: [PracticeService]
})
export class PracticeModule {} 