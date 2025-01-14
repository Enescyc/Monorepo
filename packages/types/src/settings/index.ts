import { UserMetadata } from '../user';

export interface Language {
  name: string;
  code: string;
  native: boolean;
  proficiency: ProficiencyLevel;
  startedAt: Date;
  lastStudied: Date;
}

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

export enum ProficiencyLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2'
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


