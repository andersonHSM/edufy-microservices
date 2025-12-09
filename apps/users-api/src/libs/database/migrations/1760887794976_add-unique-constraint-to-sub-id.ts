import {type Kysely} from 'kysely';

const CONSTRAINT_NAME = 'users_sub_id_unique';

export async function up(db: Kysely<any>): Promise<void> {
  // First, ensure the column is not nullable
  await db.schema
    .withSchema('users')
    .alterTable('users')
    .alterColumn('sub_id', (col) => col.setNotNull())
    .execute();

  // Then, add the unique constraint with a specific name
  await db.schema
    .withSchema('users')
    .alterTable('users')
    .addUniqueConstraint(CONSTRAINT_NAME, ['sub_id'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop the constraint by its name first
  await db.schema
    .withSchema('users')
    .alterTable('users')
    .dropConstraint(CONSTRAINT_NAME)
    .execute();

  // Then, make the column nullable again
  await db.schema
    .withSchema('users')
    .alterTable('users')
    .alterColumn('sub_id', (col) => col.dropNotNull())
    .execute();
}
