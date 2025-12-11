import { type Kysely, sql } from 'kysely';
import { Database } from '../database.type'; // Import your app's Database type

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema.createSchema('courses').ifNotExists().execute();

  await db.schema
    .withSchema('courses')
    .createTable('courses')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('price', 'numeric(10, 2)', (col) => col.notNull())
    .addColumn('instructor_sub_id', 'uuid', (col) => col.notNull())
    .addColumn('instructor_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('instructor_avatar', 'varchar(255)')
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema
    .withSchema('courses')
    .dropTable('courses')
    .ifExists()
    .execute();
}
