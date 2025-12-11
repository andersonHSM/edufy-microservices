import { registerAs } from "@nestjs/config";

export default registerAs("supportService", () => ({
  host: process.env.SUPPORT_SERVICE_HOST || "localhost",
  port: parseInt(process.env.SUPPORT_SERVICE_PORT || "3006", 10),
}));
