import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { LearningStatus } from '@vocabuddy/types';

@Entity('words')
export class Word extends BaseEntity {
  @Column()
  word: string;

  @Column()
  definition: string;

  @Column({ type: 'text', array: true, default: [] })
  examples: string[];

  @Column({ type: 'text', array: true, default: [] })
  synonyms: string[];

  @Column({ type: 'text', array: true, default: [] })
  antonyms: string[];

  @Column({ type: 'enum', enum: LearningStatus, default: LearningStatus.NEW })
  status: LearningStatus;

  @Column({ type: 'int', default: 0 })
  practiceCount: number;

  @Column({ type: 'float', default: 0 })
  masteryLevel: number;

  @Column({ type: 'timestamp', nullable: true })
  lastPracticedAt?: Date;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;
} 