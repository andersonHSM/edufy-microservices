import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const authServiceConfigSchema = z.object({
  host: z.string().min(1, 'Auth service host is required'),
  port: z.coerce.number().min(0).max(65535),
});

export default registerAs('authService', () =>
  authServiceConfigSchema.parse({
    host: process.env.AUTH_SERVICE_HOST || 'localhost',
    port: process.env.AUTH_SERVICE_PORT || 3001, // Default TCP port for auth-api
  }),
);

export type AuthServiceConfig = z.infer<typeof authServiceConfigSchema>;
