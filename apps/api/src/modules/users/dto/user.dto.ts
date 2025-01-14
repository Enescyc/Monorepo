import { IsString, IsEmail, IsOptional, IsBoolean, IsObject, IsArray, IsDate } from 'class-validator';
import { Language, UserSettings, UserProgress } from '@vocabuddy/types';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsArray()
  @IsOptional()
  languages: Language[];

  @IsObject()
  @IsOptional()
  premium: {
    isActive: boolean;
    plan: string;
    expiresAt: Date;
    features: string[];
  };

  @IsObject()
  @IsOptional()
  settings: UserSettings;

  @IsObject()
  @IsOptional()
  progress: UserProgress;

  @IsBoolean()
  @IsOptional()
  isEmailVerified: boolean;

  @IsDate()
  @IsOptional()
  lastLoginAt?: Date;

  @IsObject()
  @IsOptional()
  metadata: {
    lastActive: Date;
    deviceInfo: {
      platform: string;
      version: string;
      devices: string[];
    };
  };

  @IsArray()
  @IsOptional()
  achievements: {
    id: string;
    name: string;
    description: string;
    unlockedAt: Date;
    progress: number;
    category: string;
    icon: string;
  }[];
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsArray()
  @IsOptional()
  languages?: Language[];

  @IsObject()
  @IsOptional()
  premium?: {
    isActive: boolean;
    plan: string;
    expiresAt: Date;
    features: string[];
  };

  @IsObject()
  @IsOptional()
  settings?: UserSettings;

  @IsObject()
  @IsOptional()
  progress?: UserProgress;

  @IsBoolean()
  @IsOptional()
  isEmailVerified?: boolean;

  @IsDate()
  @IsOptional()
  lastLoginAt?: Date;

  @IsObject()
  @IsOptional()
  metadata?: {
    lastActive: Date;
    deviceInfo: {
      platform: string;
      version: string;
      devices: string[];
    };
  };

  @IsArray()
  @IsOptional()
  achievements?: {
    id: string;
    name: string;
    description: string;
    unlockedAt: Date;
    progress: number;
    category: string;
    icon: string;
  }[];
} 