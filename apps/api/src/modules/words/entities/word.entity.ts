import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Context, Etymology, Learning, LearningStatus, SynonymsAntonyms, Translation, WordCategory, WordType } from '@vocabuddy/types';

@Entity('words')
export class Word extends BaseEntity {
  @Column()
  word: string;

  @Column('jsonb', { array: true, default: [] })
  translations: Translation[];

  @Column({ nullable: true })
  pronunciation: string;

  @Column('enum', { enum: WordType, array: true })
  wordType: WordType[];

  @Column('jsonb', { array: true })
  definitions: {
    partOfSpeech: string;
    meaning: string;
    examples: string[];
  }[];

  @Column('text', { array: true, default: [] })
  examples: string[];

  @Column('jsonb', { array: true })
  category: WordCategory[];

  @Column('jsonb')
  context: Context;

  @Column('jsonb')
  etymology: Etymology;

  @Column('jsonb')
  synonymsAntonyms: SynonymsAntonyms;

  @Column('jsonb')
  learning: Learning;

  @ManyToOne(() => User, user => user.words, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;
} 