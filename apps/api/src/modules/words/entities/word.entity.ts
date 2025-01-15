import { Column, Entity, ManyToOne, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Context, Etymology, Learning, LearningStatus, SynonymsAntonyms, Translation, WordCategory, WordType } from '@vocabuddy/types';

@Entity('words')
export class Word extends BaseEntity {
  @Column()
  word: string;

  @Column('jsonb', { default: [] })
  translations: Translation[];

  @Column({ nullable: true })
  pronunciation: string;

  @Column('text', { array: true, default: '{}' })
  wordType: WordType[];

  @Column('jsonb', { default: [] })
  definitions: {
    partOfSpeech: string;
    meaning: string;
    examples: string[];
  }[];

  @Column('text', { array: true, default: '{}' })
  examples: string[];

  @Column('jsonb', { default: [] })
  category: WordCategory[];

  @Column('jsonb', { default: {} })
  context: Context;

  @Column('jsonb', { default: {} })
  etymology: Etymology;

  @Column('jsonb', { default: { synonyms: [], antonyms: [] } })
  synonymsAntonyms: SynonymsAntonyms;

  @Column('jsonb', {
    default: {
      status: 'new',
      strength: 0,
      nextReview: new Date().toISOString(),
      lastStudied: new Date().toISOString()
    },
    transformer: {
      to(value: Learning): any {
        return {
          ...value,
          nextReview: value.nextReview instanceof Date ? value.nextReview.toISOString() : value.nextReview,
          lastStudied: value.lastStudied instanceof Date ? value.lastStudied.toISOString() : value.lastStudied
        };
      },
      from(value: any): Learning {
        return {
          ...value,
          nextReview: new Date(value.nextReview),
          lastStudied: new Date(value.lastStudied)
        };
      }
    }
  })
  learning: Learning;

  @ManyToOne(() => User, user => user.words, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  @Index()
  userId: string;
} 