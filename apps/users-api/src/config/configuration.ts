export default () => ({
  port: parseInt(process.env.PORT ?? '3002', 10) ,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
});
