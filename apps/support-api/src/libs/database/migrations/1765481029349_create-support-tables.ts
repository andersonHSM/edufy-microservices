import { Kysely, sql } from 'kysely';
import { DB } from 'libs/database/kysely-support/db'; // Import DB type

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema.createSchema('support').ifNotExists().execute();

  await db.schema
    .withSchema('support')
    .createTable('tickets')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('status', 'varchar(50)', (col) => col.notNull()) // Enum: open, resolved, closed
    .addColumn('creator_sub_id', 'uuid', (col) => col.notNull())
    .addColumn('creator_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('creator_email', 'varchar(255)', (col) => col.notNull())
    .addColumn('resolved_by', 'uuid', (col) => col.references('auth.users.id')) // Assuming a users table in auth schema for FK
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute();

  await db.schema
    .withSchema('support')
    .createTable('ticket_messages')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('ticket_id', 'uuid', (col) =>
      col.references('support.tickets.id').onDelete('cascade').notNull(),
    )
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('author_sub_id', 'uuid', (col) => col.notNull())
    .addColumn('author_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute();
}

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.withSchema('support').dropTable('ticket_messages').execute();
  await db.schema.withSchema('support').dropTable('tickets').execute();
  await db.schema.dropSchema('support').ifExists().execute();
}
