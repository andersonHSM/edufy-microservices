import { registerAs } from '@nestjs/config';
import z from 'zod';

const securityConfigSchema = z.object({
  corsOrigins: z.array(z.string()).default(['http://localhost:3000']),
});

export default registerAs('security', () =>
  securityConfigSchema.parse({
    corsOrigins: process.env.CORS_ORIGINS?.split(','),
  }),
);

export type SecurityConfig = z.infer<typeof securityConfigSchema>;
