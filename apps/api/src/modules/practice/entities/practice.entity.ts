import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Word } from '../../words/entities/word.entity';

export enum PracticeType {
  FLASHCARD = 'flashcard',
  MULTIPLE_CHOICE = 'multiple_choice',
  WRITING = 'writing',
  FILL_IN_BLANK = 'fill_in_blank',
}

export enum PracticeResult {
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
  PARTIAL = 'partial',
  SKIPPED = 'skipped',
}

@Entity('practices')
export class Practice extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Word, { onDelete: 'CASCADE' })
  word: Word;

  @Column()
  wordId: string;

  @Column({ type: 'enum', enum: PracticeType })
  type: PracticeType;

  @Column({ type: 'enum', enum: PracticeResult })
  result: PracticeResult;

  @Column({ type: 'float' })
  score: number;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @Column({ type: 'timestamp' })
  completedAt: Date;
} 