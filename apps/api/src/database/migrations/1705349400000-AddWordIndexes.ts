import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddWordIndexes1705349400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create indexes for JSON fields
    await queryRunner.query(`
      CREATE INDEX "IDX_words_user_learning_status" ON "words" ("userId", (learning->>'status'));
      CREATE INDEX "IDX_words_user_learning_strength" ON "words" ("userId", ((learning->>'strength')::float));
      CREATE INDEX "IDX_words_user_learning_next_review" ON "words" ("userId", ((learning->>'nextReview')::timestamp));
      CREATE INDEX "IDX_words_user_learning_last_studied" ON "words" ("userId", ((learning->>'lastStudied')::timestamp));
      CREATE INDEX "IDX_words_user_category" ON "words" USING GIN ("userId", "category");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`
      DROP INDEX IF EXISTS "IDX_words_user_learning_status";
      DROP INDEX IF EXISTS "IDX_words_user_learning_strength";
      DROP INDEX IF EXISTS "IDX_words_user_learning_next_review";
      DROP INDEX IF EXISTS "IDX_words_user_learning_last_studied";
      DROP INDEX IF EXISTS "IDX_words_user_category";
    `);
  }
} 