import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const usersServiceConfigSchema = z.object({
  host: z.string().min(1, 'Users service host is required'),
  port: z.coerce.number().min(0).max(65535),
  queue: z.string().min(1, 'Users service queue is required'),
});

export default registerAs('usersService', () =>
  usersServiceConfigSchema.parse({
    host: process.env.USERS_SERVICE_HOST || 'localhost',
    port: process.env.USERS_SERVICE_PORT || 3002, // Default TCP port for users-api
    queue: process.env.RABBITMQ_USERS_QUEUE,
  }),
);

export type UsersServiceConfig = z.infer<typeof usersServiceConfigSchema>;
