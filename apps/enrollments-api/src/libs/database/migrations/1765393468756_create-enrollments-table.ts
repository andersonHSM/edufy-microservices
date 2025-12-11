import { type Kysely, sql } from 'kysely';
import { Database } from '../database.type';

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema.createSchema('enrollments').ifNotExists().execute();

  await db.schema
    .withSchema('enrollments')
    .createTable('enrollments')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('user_id', 'uuid', (col) => col.notNull())
    .addColumn('course_id', 'uuid', (col) => col.notNull())
    .addColumn('enrolled_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema
    .withSchema('enrollments')
    .dropTable('enrollments')
    .ifExists()
    .execute();
}
