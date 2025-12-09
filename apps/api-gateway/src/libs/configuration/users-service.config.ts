import { registerAs } from "@nestjs/config";
import z from "zod";

const authServiceConfigSchema = z.object({
  host: z.string().min(1, "Users service host is required"),
  port: z.coerce
    .number()
    .positive("Users service port must be a positive number"),
});

export default registerAs("authService", () =>
  authServiceConfigSchema.parse({
    host: process.env.USERS_SERVICE_HOST,
    port: process.env.USERS_SERVICE_PORT,
  }),
);

export type AuthServiceConfig = z.infer<typeof authServiceConfigSchema>;
