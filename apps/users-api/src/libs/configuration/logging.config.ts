import {registerAs} from '@nestjs/config';
import z from 'zod';

const loggingConfigSchema = z.object({
	level: z.string().default('info'),
	format: z.string().default('json'),
});

export default registerAs('logging', () =>
	loggingConfigSchema.parse({
		level: process.env.LOG_LEVEL,
		format: process.env.LOG_FORMAT,
	}),
);

export type LoggingConfig = z.infer<typeof loggingConfigSchema>;
