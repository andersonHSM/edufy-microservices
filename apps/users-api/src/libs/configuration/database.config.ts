import {registerAs} from '@nestjs/config';
import z from 'zod';

const databaseConfigSchema = z.object({
	type: z.string().default('postgres'),
	host: z.string().default('localhost'),
	port: z.coerce.number().default(5433),
	username: z.string().default('users_user'),
	password: z.string().default('users_password'),
	database: z.string().default('users_db'),
	schema: z.string().default('users'),
	url: z.string().optional(),
	ssl: z.coerce.boolean().default(false),
	synchronize: z.coerce.boolean().default(false),
	logging: z.coerce.boolean().default(false),
	maxConnections: z.coerce.number().default(100),
	connectionTimeout: z.coerce.number().default(60000),
});

export default registerAs('database', () =>
	databaseConfigSchema.parse({
		type: process.env.DATABASE_TYPE,
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT,
		username: process.env.DATABASE_USERNAME,
		password: process.env.DATABASE_PASSWORD,
		database: process.env.DATABASE_NAME,
		schema: process.env.DATABASE_SCHEMA,
		url: process.env.DATABASE_URL,
		ssl: process.env.DATABASE_SSL,
		synchronize: process.env.DATABASE_SYNCHRONIZE,
		logging: process.env.DATABASE_LOGGING,
		maxConnections: process.env.DATABASE_MAX_CONNECTIONS,
		connectionTimeout: process.env.DATABASE_CONNECTION_TIMEOUT,
	}),
);

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;
