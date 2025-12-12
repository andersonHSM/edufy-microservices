import { registerAs } from "@nestjs/config";
import { z } from "zod";

const SupportServiceSchema = z.object({
  host: z.string().default("localhost"),
  port: z.preprocess(
    (val) => parseInt(z.string().parse(val), 10),
    z.number().min(0).max(65535),
  ),
});

export default registerAs("supportService", () =>
  SupportServiceSchema.parse({
    host: process.env.SUPPORT_SERVICE_HOST,
    port: process.env.SUPPORT_SERVICE_PORT,
  }),
);
