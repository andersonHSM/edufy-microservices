import { Kysely } from 'kysely';
import { DB } from 'src/libs/database/generated/db';

export type Database = Kysely<DB>;
