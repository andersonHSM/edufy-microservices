import { Inject, Injectable } from '@nestjs/common';
import { DATABASE } from './constants';
import { type Database } from './database.type';

@Injectable()
export abstract class KyselyRepository {
  protected constructor(
    @Inject(DATABASE) protected readonly database: Database,
  ) {}
}
