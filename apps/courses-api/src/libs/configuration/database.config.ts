import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const databaseConfigSchema = z.object({
  url: z.string().min(1),
  directUrl: z.string().min(1),
});

export default registerAs('database', () =>
  databaseConfigSchema.parse({
    url: process.env.DATABASE_URL,
    directUrl: process.env.DATABASE_DIRECT_URL,
  }),
);

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;
