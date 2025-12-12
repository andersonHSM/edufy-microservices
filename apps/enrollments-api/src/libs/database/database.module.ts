import { Global, Module } from '@nestjs/common';
import { DATABASE } from './constants';
import { databaseProvider } from './database.provider';

@Global()
@Module({
  providers: [databaseProvider],
  exports: [DATABASE], // Export the Kysely instance
})
export class DatabaseModule {}
