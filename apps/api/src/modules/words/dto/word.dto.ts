import { IsString, IsArray, IsObject, IsOptional, IsEnum } from 'class-validator';
import { WordType, Translation, Context, Etymology, SynonymsAntonyms, WordCategory, LearningStyle, Difficulty, Language, Learning } from '@vocabuddy/types';

export class CreateWordDto {
    @IsString()
    word: string;

    @IsString()
    userId: string;

    @IsString()
    nativeLanguage: string;

    @IsArray()
    targetLanguages: Language[];

    @IsString()
    learningStyle: LearningStyle[];

    @IsString()
    difficulty: Difficulty;

    @IsString()
    appLanguage: string;
}

export class UpdateWordDto {
  @IsOptional()
  @IsString()
  word?: string;

  @IsOptional()
  @IsArray()
  translations?: Translation[];

  @IsOptional()
  @IsString()
  pronunciation?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(WordType, { each: true })
  wordType?: WordType[];

  @IsOptional()
  @IsArray()
  definitions?: {
    partOfSpeech: string;
    meaning: string;
    examples: string[];
  }[];

  @IsOptional()
  @IsArray()
  examples?: string[];

  @IsOptional()
  @IsArray()
  category?: WordCategory[];

  @IsOptional()
  @IsObject()
  context?: Context;

  @IsOptional()
  @IsObject()
  etymology?: Etymology;

  @IsOptional()
  @IsObject()
  synonymsAntonyms?: SynonymsAntonyms;

  @IsOptional()
  @IsObject()
  learning?: Partial<Learning>;
} 