import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LearningStatus } from '@vocabuddy/types';

export class CreateWordDto {
  @IsString()
  @IsNotEmpty()
  word: string;

  @IsString()
  @IsNotEmpty()
  definition: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  examples?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  synonyms?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  antonyms?: string[];

  @IsEnum(LearningStatus)
  @IsOptional()
  status?: LearningStatus;
} 