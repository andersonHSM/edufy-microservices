import { registerAs } from '@nestjs/config';
import z from 'zod';

const servicesConfigSchema = z.object({
  authService: z.object({
    url: z.string().default('http://localhost:3001'),
    timeout: z.coerce.number().default(5000),
  }),
  notificationService: z.object({
    url: z.string().optional(),
  }),
});

export default registerAs('services', () =>
  servicesConfigSchema.parse({
    authService: {
      url: process.env.AUTH_SERVICE_URL,
      timeout: process.env.AUTH_SERVICE_TIMEOUT,
    },
    notificationService: {
      url: process.env.NOTIFICATION_SERVICE_URL,
    },
  }),
);

export type ServicesConfig = z.infer<typeof servicesConfigSchema>;
