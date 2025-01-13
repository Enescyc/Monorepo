import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1736728592248 implements MigrationInterface {
    name = 'Initial1736728592248'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "base_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_03e6c58047b7a4b3f6de0bfa8d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "isEmailVerified" boolean NOT NULL DEFAULT false, "avatarUrl" character varying, "settings" jsonb NOT NULL DEFAULT '{}', "isPremium" boolean NOT NULL DEFAULT false, "lastLoginAt" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."words_status_enum" AS ENUM('new', 'learning', 'mastered')`);
        await queryRunner.query(`CREATE TABLE "words" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "word" character varying NOT NULL, "definition" character varying NOT NULL, "examples" text array NOT NULL DEFAULT '{}', "synonyms" text array NOT NULL DEFAULT '{}', "antonyms" text array NOT NULL DEFAULT '{}', "status" "public"."words_status_enum" NOT NULL DEFAULT 'new', "practiceCount" integer NOT NULL DEFAULT '0', "masteryLevel" double precision NOT NULL DEFAULT '0', "lastPracticedAt" TIMESTAMP, "metadata" jsonb NOT NULL DEFAULT '{}', "userId" uuid NOT NULL, CONSTRAINT "PK_feaf97accb69a7f355fa6f58a3d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."practices_type_enum" AS ENUM('flashcard', 'multiple_choice', 'writing', 'fill_in_blank')`);
        await queryRunner.query(`CREATE TYPE "public"."practices_result_enum" AS ENUM('correct', 'incorrect', 'partial', 'skipped')`);
        await queryRunner.query(`CREATE TABLE "practices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "wordId" uuid NOT NULL, "type" "public"."practices_type_enum" NOT NULL, "result" "public"."practices_result_enum" NOT NULL, "score" double precision NOT NULL, "metadata" jsonb NOT NULL DEFAULT '{}', "completedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_0934829c5859a843625e6ff1c34" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "words" ADD CONSTRAINT "FK_3f75018aa783695bfd293f0dc26" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "practices" ADD CONSTRAINT "FK_2f8bdbfb073c83adea30897eb7c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "practices" ADD CONSTRAINT "FK_2e49b5deaef1712ac5fb50c6cdf" FOREIGN KEY ("wordId") REFERENCES "words"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "practices" DROP CONSTRAINT "FK_2e49b5deaef1712ac5fb50c6cdf"`);
        await queryRunner.query(`ALTER TABLE "practices" DROP CONSTRAINT "FK_2f8bdbfb073c83adea30897eb7c"`);
        await queryRunner.query(`ALTER TABLE "words" DROP CONSTRAINT "FK_3f75018aa783695bfd293f0dc26"`);
        await queryRunner.query(`DROP TABLE "practices"`);
        await queryRunner.query(`DROP TYPE "public"."practices_result_enum"`);
        await queryRunner.query(`DROP TYPE "public"."practices_type_enum"`);
        await queryRunner.query(`DROP TABLE "words"`);
        await queryRunner.query(`DROP TYPE "public"."words_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "base_entity"`);
    }

}
