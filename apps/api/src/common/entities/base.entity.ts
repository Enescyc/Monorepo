import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamptz',
    transformer: {
      to(value: Date | number): Date {
        return value instanceof Date ? value : new Date();
      },
      from(value: Date | string | number): Date {
        return new Date(value);
      }
    }
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    transformer: {
      to(value: Date | number): Date {
        return value instanceof Date ? value : new Date();
      },
      from(value: Date | string | number): Date {
        return new Date(value);
      }
    }
  })
  updatedAt: Date;
}   