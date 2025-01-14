import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Exclude } from 'class-transformer';
import { Language, UserSettings, UserProgress } from '@vocabuddy/types';
import { Word } from '../../words/entities/word.entity';
import { PracticeSession } from '../../practice/entities/practice.entity';

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

  @Column('jsonb', { array: true, default: [] })
  languages: Language[];

  @Column('jsonb')
  premium: {
    isActive: boolean;
    plan: string;
    expiresAt: Date;
    features: string[];
  };

  @Column('jsonb')
  settings: UserSettings;

  @Column('jsonb')
  progress: UserProgress;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @Column('jsonb', { default: {} })
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

  @Column('jsonb', { array: true, default: [] })
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