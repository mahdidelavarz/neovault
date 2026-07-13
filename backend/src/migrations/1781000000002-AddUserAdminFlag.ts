import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserAdminFlag1781000000002 implements MigrationInterface {
    name = 'AddUserAdminFlag1781000000002';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_admin" BOOLEAN NOT NULL DEFAULT false`);
        await queryRunner.query(`UPDATE "users" SET "is_admin" = true WHERE "email" = 'mdelever77@gmail.com'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "is_admin"`);
    }
}
