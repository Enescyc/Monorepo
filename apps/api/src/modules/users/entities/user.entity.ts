import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Exclude } from 'class-transformer';
import { Language, UserSettings, UserProgress, LanguageType, LANGUAGES } from '@vocabuddy/types';
import { Word } from '../../words/entities/word.entity';
import { PracticeSession } from '../../practice/entities/practice.entity';
import { Premium, PremiumPlan } from '@vocabuddy/types/dist/premium';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column('jsonb', { default: [] })
  languages: Language[];

  @Column('jsonb', {
    default: {
      isActive: false,
      plan: PremiumPlan.FREE,
      expiresAt: null,
      features: [],
    },
  })
  premium: Premium;

  @Column('jsonb', {
    default: {
      theme: 'light',
      notifications: true,
      emailNotifications: true,
      soundEffects: true,
    },
  })
  settings: UserSettings;

  @Column('jsonb', {
    default: {
      overall: {
        totalWords: 0,
        masteredWords: 0,
        wordsInProgress: 0,
        totalStudyTime: 0,
      },
      streak: {
        current: 0,
        longest: 0,
        lastStudyDate: new Date(),
      },
      xp: {
        total: 0,
        level: 1,
        currentLevelProgress: 0,
      },
    },
  })
  progress: UserProgress;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @Column('jsonb', {
    default: {
      lastActive: new Date(),
      deviceInfo: {
        platform: '',
        version: '',
        devices: [],
      },
    },
  })
  metadata: {
    lastActive: Date;
    deviceInfo: {
      platform: string;
      version: string;
      devices: string[];
    };
  };

  @OneToMany(() => Word, word => word.user)
  words: Word[];

  @OneToMany(() => PracticeSession, session => session.user)
  sessions: PracticeSession[];

  @Column('jsonb', { default: [] })
  achievements: {
    id: string;
    name: string;
    description: string;
    unlockedAt: Date;
    progress: number;
    category: string;
    icon: string;
  }[];

  @Column({ default: LANGUAGES.ENGLISH })
  appLanguage: LanguageType;
} 