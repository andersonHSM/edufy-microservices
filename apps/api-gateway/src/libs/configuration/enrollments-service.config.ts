import { registerAs } from "@nestjs/config";
import z from "zod";

const enrollmentsServiceConfigSchema = z.object({
  host: z.string().min(1, "Enrollments service host is required"),
  port: z.coerce
    .number()
    .positive("Enrollments service port must be a positive number"),
});

export default registerAs("enrollments-service", () =>
  enrollmentsServiceConfigSchema.parse({
    host: process.env.ENROLLMENTS_SERVICE_HOST,
    port: process.env.ENROLLMENTS_SERVICE_PORT,
  }),
);

export type EnrollmentsServiceConfig = z.infer<
  typeof enrollmentsServiceConfigSchema
>;
