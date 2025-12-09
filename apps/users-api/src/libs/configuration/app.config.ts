import {registerAs} from '@nestjs/config';
import z from 'zod';

const appConfigSchema = z.object({
	name: z.string().default('Users API'),
	port: z.coerce.number().default(3002),
	nodeEnv: z.string().default('development'),
	apiPrefix: z.string().default('api/v1'),
});

export default registerAs('app', () =>
	appConfigSchema.parse({
		name: process.env.APP_NAME,
		port: process.env.PORT,
		nodeEnv: process.env.NODE_ENV,
		apiPrefix: process.env.API_PREFIX,
	}),
);

export type AppConfig = z.infer<typeof appConfigSchema>;
