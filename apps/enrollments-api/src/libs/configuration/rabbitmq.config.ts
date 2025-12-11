import { registerAs } from '@nestjs/config';
import z from 'zod';

const rabbitMQConfigSchema = z.object({
  url: z.string().min(1, 'RabbitMQ url is required'),
  enrollmentsQueue: z.string().min(1, 'RabbitMQ enrollments queue is required'),
  coursesQueue: z.string().min(1, 'RabbitMQ courses queue is required'),
  usersQueue: z.string().min(1, 'RabbitMQ users queue is required'),
});

export default registerAs('rabbitMQ', () =>
  rabbitMQConfigSchema.parse({
    url: process.env.RABBITMQ_URL,
    enrollmentsQueue: process.env.RABBITMQ_ENROLLMENTS_QUEUE,
    coursesQueue: process.env.RABBITMQ_COURSES_QUEUE,
    usersQueue: process.env.RABBITMQ_USERS_QUEUE,
  }),
);

export type RabbitMQConfig = z.infer<typeof rabbitMQConfigSchema>;
