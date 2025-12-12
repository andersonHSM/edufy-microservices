import { registerAs } from '@nestjs/config';
import z from 'zod';

const rabbitMQConfigSchema = z.object({
  url: z.string().min(1, 'RabbitMQ url is required'),
  supportQueue: z.string().min(1, 'RabbitMQ support queue is required'),
});

export default registerAs('rabbitMQ', () =>
  rabbitMQConfigSchema.parse({
    url: process.env.RABBITMQ_URL,
    supportQueue: process.env.RABBITMQ_SUPPORT_QUEUE,
  }),
);

export type RabbitMQConfig = z.infer<typeof rabbitMQConfigSchema>;
