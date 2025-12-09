import { registerAs } from "@nestjs/config";
import z from "zod";

const authServiceConfigSchema = z.object({
  host: z.string().min(1, "Auth service host is required"),
  port: z.coerce
    .number()
    .positive("Auth service port must be a positive number"),
});

export default registerAs("authService", () =>
  authServiceConfigSchema.parse({
    host: process.env.AUTH_SERVICE_HOST,
    port: process.env.AUTH_SERVICE_PORT,
  }),
);

export type AuthServiceConfig = z.infer<typeof authServiceConfigSchema>;
