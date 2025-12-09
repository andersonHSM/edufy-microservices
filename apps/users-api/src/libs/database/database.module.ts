import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { DATABASE } from './constants';
import { databaseProvider } from './database.provider';
import { type Database } from './database.type';

@Global()
@Module({
  imports: [],
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(
    @Inject(DATABASE)
    private readonly database: Database,
  ) {}

  async onModuleDestroy() {
    await this.database.destroy();
  }
}
