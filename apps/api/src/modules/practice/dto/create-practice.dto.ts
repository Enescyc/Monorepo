import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { PracticeType, PracticeResult } from '../entities/practice.entity';

export class CreatePracticeDto {
  @IsString()
  @IsNotEmpty()
  wordId: string;

  @IsEnum(PracticeType)
  @IsNotEmpty()
  type: PracticeType;

  @IsEnum(PracticeResult)
  @IsNotEmpty()
  result: PracticeResult;

  @IsNumber()
  @IsNotEmpty()
  score: number;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
} 