import { IsArray, IsEnum, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { 
  PracticeSessionType, 
  PracticeWordPerformance,
  PracticeSessionSettings,
  PracticeSessionResults,
  PracticeWord
} from '@vocabuddy/types';

export class CreatePracticeSessionDto {
  @IsArray()
  words: PracticeWord[];

  @IsEnum(PracticeSessionType)
  sessionType: PracticeSessionType;

  @IsInt()
  @Min(0)
  duration: number;

  @IsInt()
  @Min(0)
  score: number;

  @IsObject()
  settings: PracticeSessionSettings;

  @IsObject()
  results: PracticeSessionResults;
}

export class UpdatePracticeSessionDto {
  @IsOptional()
  @IsArray()
  words?: PracticeWord[];

  @IsOptional()
  @IsEnum(PracticeSessionType)
  sessionType?: PracticeSessionType;

  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  score?: number;

  @IsOptional()
  @IsObject()
  settings?: PracticeSessionSettings;

  @IsOptional()
  @IsObject()
  results?: PracticeSessionResults;
}

export class RecordPracticeDto {
  @IsInt()
  @Min(0)
  timeSpent: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
} 