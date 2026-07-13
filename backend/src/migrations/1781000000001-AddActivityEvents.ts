import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActivityEvents1781000000001 implements MigrationInterface {
    name = 'AddActivityEvents1781000000001';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "activity_events" (
                "id"            SERIAL PRIMARY KEY,
                "type"          VARCHAR(40)   NOT NULL,
                "module"        VARCHAR(60)   NOT NULL,
                "action"        VARCHAR(120)  NOT NULL,
                "method"        VARCHAR(30)   NOT NULL,
                "path"          VARCHAR(255),
                "resource_type" VARCHAR(80),
                "resource_id"   VARCHAR(80),
                "user_agent"    VARCHAR(255),
                "ip_address"    VARCHAR(80),
                "user_id"       INTEGER       NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
                "created_at"    TIMESTAMP     NOT NULL DEFAULT now()
            )
        `);

        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_activity_events_user_created" ON "activity_events" ("user_id", "created_at")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_activity_events_type_created" ON "activity_events" ("type", "created_at")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_activity_events_created_at" ON "activity_events" ("created_at")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "activity_events"`);
    }
}
