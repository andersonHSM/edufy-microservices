import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const appConfigSchema = z.object({
  port: z.coerce.number().min(0).max(65535),
  env: z.enum(['development', 'production', 'test']),
  name: z.string().min(1),
});

export default registerAs('app', () =>
  appConfigSchema.parse({
    port: process.env.PORT || 3006, // Default port for support-api (updated as per instruction)
    env: process.env.NODE_ENV || 'development',
    name: 'SupportAPI',
  }),
);

export type AppConfig = z.infer<typeof appConfigSchema>;
