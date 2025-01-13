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
  profile: UserProfile;
  isEmailVerified: boolean;
  lastLoginAt?: number;
}

export interface UserProfile extends User {
  languages: Language[];
  premium: Premium;
  settings: UserSettings;
  sessions: PracticeSession[];
  words: Word[];
  achievements: Achievement[];
  progress: UserProgress;
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