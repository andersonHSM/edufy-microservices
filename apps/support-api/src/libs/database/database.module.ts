import { Global, Module } from '@nestjs/common';
import { DATABASE } from 'libs/database/constants';
import { databaseProvider } from 'libs/database/database.provider';

@Global()
@Module({
  providers: [databaseProvider],
  exports: [DATABASE], // Export the Kysely instance
})
export class DatabaseModule {}
