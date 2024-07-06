import { MigrationInterface, QueryRunner } from "typeorm";

export class DatabaseInitialSeeds1720256383780 implements MigrationInterface {
    name = 'DatabaseInitialSeeds1720256383780'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
          INSERT INTO "account" (id, balance)
          VALUES 
            ('fbf4a552-2418-46c5-b308-6094ddc493a1', 10),
            ('9c3cd9a8-65c4-4d26-8488-ef9a40f57c37', -7)
        `);
    
        await queryRunner.query(`
          INSERT INTO "transaction" (id, account_id, amount, created_at)
          VALUES 
            ('4bcc3959-6fe1-406e-9f04-cad2637b47d5', 'fbf4a552-2418-46c5-b308-6094ddc493a1', 10, '2021-05-12T18:29:40.206924+00:00'),
            ('050a75f6-8df1-4ad1-8f5b-54e821e98581', '9c3cd9a8-65c4-4d26-8488-ef9a40f57c37', -7, '2021-05-18T21:33:47.203136+00:00')
        `);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "transaction"`);
        await queryRunner.query(`DELETE FROM "account"`);
      }
}
