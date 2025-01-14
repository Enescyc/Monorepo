import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Word } from '../../words/entities/word.entity';
import { 
  PracticeSessionType, 
  PracticeWordPerformance, 
  ReviewType,
  PracticeSessionSettings,
  PracticeSessionResults,
  PracticeWord as IPracticeWord,
  Difficulty
} from '@vocabuddy/types';

@Entity('practice_sessions')
export class PracticeSession extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @Column('jsonb', { array: false, default: [] })
  words: IPracticeWord[];

  @Column({ type: 'enum', enum: PracticeSessionType })
  sessionType: PracticeSessionType;

  @Column('int')
  duration: number;

  @Column('float')
  score: number;

  @Column('jsonb')
  settings: PracticeSessionSettings;

  @Column('jsonb')
  results: PracticeSessionResults;
} 