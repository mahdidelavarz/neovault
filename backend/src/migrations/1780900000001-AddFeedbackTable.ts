import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFeedbackTable1780900000001 implements MigrationInterface {
    name = 'AddFeedbackTable1780900000001';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "feedback" (
                "id"         SERIAL PRIMARY KEY,
                "type"       VARCHAR(20)   NOT NULL,
                "message"    TEXT          NOT NULL,
                "user_id"    INTEGER       NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
                "created_at" TIMESTAMP     NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP     NOT NULL DEFAULT now()
            )
        `);

        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_feedback_created_at" ON "feedback" ("created_at")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_feedback_user_id" ON "feedback" ("user_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "feedback"`);
    }
}
