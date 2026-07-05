import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFilesTable1780800000001 implements MigrationInterface {
    name = 'AddFilesTable1780800000001';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "files" (
                "id"            SERIAL PRIMARY KEY,
                "filename"      VARCHAR(255)  NOT NULL,
                "original_name" VARCHAR(255)  NOT NULL,
                "mimetype"      VARCHAR(100)  NOT NULL,
                "size"          INTEGER       NOT NULL,
                "path"          VARCHAR(500)  NOT NULL,
                "description"   TEXT,
                "user_id"       INTEGER       NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
                "created_at"    TIMESTAMP     NOT NULL DEFAULT now(),
                "updated_at"    TIMESTAMP     NOT NULL DEFAULT now()
            )
        `);

        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_files_user_id_created_at" ON "files" ("user_id", "created_at")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_files_user_id" ON "files" ("user_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "files"`);
    }
}
