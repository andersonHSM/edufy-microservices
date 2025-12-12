import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const coursesServiceConfigSchema = z.object({
  host: z.string().min(1, 'Courses service host is required'),
  port: z.coerce.number().min(0).max(65535),
});

export default registerAs('coursesService', () =>
  coursesServiceConfigSchema.parse({
    host: process.env.COURSES_SERVICE_HOST || 'localhost',
    port: process.env.COURSES_SERVICE_PORT || 3004, // Default TCP port for courses-api
  }),
);

export type CoursesServiceConfig = z.infer<typeof coursesServiceConfigSchema>;
