import { Kysely } from 'kysely';
import { DB } from './kysely-support/db';

export class KyselyRepository {
  constructor(protected readonly database: Kysely<DB>) {}
}
