import { BaseEntity } from '../common/base';
import { Language, ProficiencyLevel, UserSettings } from '../settings';
import { Premium } from '../premium';
import { Word } from '../word';
import { Achievement } from '../achievement';
import { PracticeSession } from '../practice';

export interface User extends BaseEntity {
  name: string;
  email: string;
  username: string;
  password: string;
  sessions: PracticeSession[];
  achievements: Achievement[];
  progress: UserProgress;
  words: Word[];
  settings: UserSettings;
  premium: Premium;
  languages: Language[];
  isEmailVerified: boolean;
  lastLoginAt?: number;
}

export interface UserProgress {
  overall: OverallProgress;
  streak: StreakProgress;
  xp: XpProgress;
}

export interface OverallProgress {
  totalWords: number;
  masteredWords: number;
  wordsInProgress: number;
  totalStudyTime: number;
}

export interface StreakProgress {
  current: number;
  longest: number;
  lastStudyDate: Date;
}

export interface XpProgress {
  total: number;
  level: number;
  currentLevelProgress: number;
}

export interface UserMetadata {
  lastActive: Date;
  deviceInfo: {
    platform: string;
    version: string;
    devices: string[];
  };
} 