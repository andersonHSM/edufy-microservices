export default () => ({
  app: {
    name: process.env.APP_NAME || "API Gateway",
    port: parseInt(process.env.PORT ?? "3000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    apiPrefix: process.env.API_PREFIX || "api",
  },
  authService: {
    host: process.env.AUTH_SERVICE_HOST || "127.0.0.1",
    port: parseInt(process.env.AUTH_SERVICE_PORT ?? "3001", 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "json",
  },
});
