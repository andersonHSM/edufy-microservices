export default () => ({
	app: {
		name: process.env.APP_NAME || 'Users API',
		port: parseInt(process.env.PORT ?? '3002', 10),
		nodeEnv: process.env.NODE_ENV || 'development',
		apiPrefix: process.env.API_PREFIX || 'api/v1',
	},
	database: {
		type: process.env.DATABASE_TYPE || 'postgres',
		host: process.env.DATABASE_HOST || 'localhost',
		port: parseInt(process.env.DATABASE_PORT ?? '5433', 10),
		username: process.env.DATABASE_USERNAME || 'users_user',
		password: process.env.DATABASE_PASSWORD || 'users_password',
		database: process.env.DATABASE_NAME || 'users_db',
		schema: process.env.DATABASE_SCHEMA || 'users',
		url: process.env.DATABASE_URL,
		ssl: process.env.DATABASE_SSL === 'true',
		synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
		logging: process.env.DATABASE_LOGGING === 'true',
		maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS ?? '100', 10),
		connectionTimeout: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT ?? '60000', 10),
	},
	jwt: {
		secret: process.env.JWT_SECRET,
		issuer: process.env.JWT_ISSUER || 'edufy-auth-service',
	},
	redis: {
		host: process.env.REDIS_HOST || 'localhost',
		port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
		password: process.env.REDIS_PASSWORD,
		db: parseInt(process.env.REDIS_DB ?? '1', 10),
		ttl: parseInt(process.env.REDIS_TTL ?? '3600', 10),
		keyPrefix: process.env.REDIS_KEY_PREFIX || 'users:',
	},
  rabbitMQ: {
    url: process.env.RABBITMQ_URL,
    usersQueue: process.env.RABBITMQ_USERS_QUEUE,
  },
	upload: {
		maxSize: parseInt(process.env.UPLOAD_MAX_SIZE ?? '10485760', 10), // 10MB
		allowedTypes: process.env.UPLOAD_ALLOWED_TYPES?.split(',') || ['image/jpeg', 'image/png'],
		path: process.env.UPLOAD_PATH || './uploads',
		urlPrefix: process.env.UPLOAD_URL_PREFIX || '/uploads',
		aws: {
			s3Bucket: process.env.AWS_S3_BUCKET,
			s3Region: process.env.AWS_S3_REGION,
			accessKeyId: process.env.AWS_ACCESS_KEY_ID,
			secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
		},
	},
	security: {
		corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
	},
	services: {
		authService: {
			url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
			timeout: parseInt(process.env.AUTH_SERVICE_TIMEOUT ?? '5000', 10),
		},
		notificationService: {
			url: process.env.NOTIFICATION_SERVICE_URL,
		},
	},
	throttle: {
		ttl: parseInt(process.env.THROTTLE_TTL ?? '60', 10),
		limit: parseInt(process.env.THROTTLE_LIMIT ?? '20', 10),
	},
	logging: {
		level: process.env.LOG_LEVEL || 'info',
		format: process.env.LOG_FORMAT || 'json',
	},
	healthCheck: {
		database: process.env.HEALTH_CHECK_DATABASE === 'true',
		redis: process.env.HEALTH_CHECK_REDIS === 'true',
		authService: process.env.HEALTH_CHECK_AUTH_SERVICE === 'true',
	},
	notifications: {
		emailEnabled: process.env.EMAIL_NOTIFICATION_ENABLED === 'true',
	},
});
