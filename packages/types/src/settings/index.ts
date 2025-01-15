import { UserMetadata } from '../user';
import { Language } from '../language';

export interface UserSettings {
  dailyGoal: number;
  studyReminders: {
    enabled: boolean;
    times: string[];
    days: string[];
  };
  learningStyle: LearningStyle[];
  difficulty: Difficulty;
  notifications: NotificationSettings;
  theme: Theme;
  fontScale: FontScale;
  metadata: UserMetadata;
  // Profile settings
  bio?: string;
  location?: string;
  nativeLanguage?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface NotificationSettings {
  enabled: boolean;
  times: string[];
  days: string[];
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export enum LearningStyle {
  VISUAL = 'visual',
  AUDITORY = 'auditory',
  READING = 'reading',
  KINESTHETIC = 'kinesthetic'
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum FontScale {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large'
} 


