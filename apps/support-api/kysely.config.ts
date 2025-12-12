import {
  CamelCasePlugin,
  DeduplicateJoinsPlugin,
  PostgresDialect,
} from 'kysely';
import { defineConfig } from 'kysely-ctl';
import { Pool } from 'pg';
// This import is not actually used by kysely-ctl as it doesn't run in NestJS context
// import { DatabaseConfig } from 'libs/configuration/database.config';

export default defineConfig({
  dialect: () => {
    const databaseUrl = new URL(
      process.env.DATABASE_DIRECT_URL ||
        process.env.DATABASE_URL ||
        'postgresql://user:password@localhost:5432/db',
    );
    return new PostgresDialect({
      pool: new Pool({
        connectionString: databaseUrl.toString(),
      }),
    });
  },
  migrations: {
    migrationFolder: './src/libs/database/migrations',
  },
  plugins: [new CamelCasePlugin(), new DeduplicateJoinsPlugin()],
  $env: {
    test: {
      dialect: () => {
        const testDatabaseUrl = new URL(
          process.env.DATABASE_DIRECT_URL ||
            process.env.DATABASE_URL ||
            'postgresql://user:password@localhost:5432/test_db',
        );
        testDatabaseUrl.pathname = '/test'; // Ensure test database is separate
        return new PostgresDialect({
          pool: new Pool({
            connectionString: testDatabaseUrl.toString(),
          }),
        });
      },
    },
  },
});
