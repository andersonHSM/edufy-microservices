export default () => ({
  app: {
    name: process.env.APP_NAME || "API Gateway",
    port: parseInt(process.env.PORT ?? "3000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    apiPrefix: process.env.API_PREFIX || "api",
  },
  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "json",
  },
});
