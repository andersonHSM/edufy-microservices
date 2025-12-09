import { registerAs } from "@nestjs/config";
import z from "zod";

const userServiceConfigSchema = z.object({
  host: z.string().min(1, "User service host is required"),
  port: z.coerce
    .number()
    .positive("User service port must be a positive number"),
});

export default registerAs("userService", () =>
  userServiceConfigSchema.parse({
    host: process.env.USERS_SERVICE_HOST,
    port: process.env.USERS_SERVICE_PORT,
  }),
);

export type UserServiceConfig = z.infer<typeof userServiceConfigSchema>;
