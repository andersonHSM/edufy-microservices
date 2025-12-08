import {registerAs} from '@nestjs/config';
import z from 'zod';

const throttleConfigSchema = z.object({
	ttl: z.coerce.number().default(60),
	limit: z.coerce.number().default(20),
});

export default registerAs('throttle', () =>
	throttleConfigSchema.parse({
		ttl: process.env.THROTTLE_TTL,
		limit: process.env.THROTTLE_LIMIT,
	}),
);

export type ThrottleConfig = z.infer<typeof throttleConfigSchema>;
