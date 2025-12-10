import { registerAs } from '@nestjs/config';
import z from 'zod';

const rabbitMQConfigSchema = z.object({
  url: z.string().min(1, 'RabbitMQ url is required'),
  usersQueue: z.string().min(1, 'RabbitMQ users queue is required'),
  authQueue: z.string().min(1, 'RabbitMQ auth queue is required'),
});

export default registerAs('rabbitMQ', () =>
  rabbitMQConfigSchema.parse({
    url: process.env.RABBITMQ_URL,
    usersQueue: process.env.RABBITMQ_USERS_QUEUE,
    authQueue: process.env.RABBITMQ_AUTH_QUEUE,
  }),
);

export type RabbitMQConfig = z.infer<typeof rabbitMQConfigSchema>;
