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
    .addColumn('enrolled_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('student_sub_id', 'uuid', (col) => col.notNull())
    .addColumn('course_id', 'uuid', (col) => col.notNull())
    .addColumn('status', 'text', (col) => col.notNull())
    .addColumn('price_paid', 'decimal', (col) => col.notNull())
    .addColumn('course_title', 'text', (col) => col.notNull())
    .addColumn('student_name', 'text', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema
    .withSchema('enrollments')
    .dropTable('enrollments')
    .ifExists()
    .execute();
}
