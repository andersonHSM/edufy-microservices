import { registerAs } from '@nestjs/config';
import z from 'zod';

const usersServiceConfigSchema = z.object({
  queue: z.string().min(1, 'Users service queue is required'),
});

export default registerAs('usersService', () =>
  usersServiceConfigSchema.parse({
    queue: process.env.RABBITMQ_USERS_QUEUE,
  }),
);

export type UsersServiceConfig = z.infer<typeof usersServiceConfigSchema>;
