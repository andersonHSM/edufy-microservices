import {registerAs} from '@nestjs/config';
import z from 'zod';

const healthCheckConfigSchema = z.object({
	database: z.coerce.boolean().default(true),
	redis: z.coerce.boolean().default(true),
	authService: z.coerce.boolean().default(true),
});

export default registerAs('healthCheck', () =>
	healthCheckConfigSchema.parse({
		database: process.env.HEALTH_CHECK_DATABASE,
		redis: process.env.HEALTH_CHECK_REDIS,
		authService: process.env.HEALTH_CHECK_AUTH_SERVICE,
	}),
);

export type HealthCheckConfig = z.infer<typeof healthCheckConfigSchema>;
