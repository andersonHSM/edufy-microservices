import { registerAs } from '@nestjs/config';
import z from 'zod';

const jwtConfigSchema = z.object({
  secret: z.string().min(1, 'JWT secret is required'),
  issuer: z.string().default('edufy-auth-service'),
});

export default registerAs('jwt', () =>
  jwtConfigSchema.parse({
    secret: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER,
  }),
);

export type JwtConfig = z.infer<typeof jwtConfigSchema>;
