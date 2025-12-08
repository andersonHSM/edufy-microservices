import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import appConfig from "src/libs/configuration/app.config";
import databaseConfig from './database.config';
import healthcheckConfig from './healthcheck.config';
import jwtConfig from './jwt.config';
import loggingConfig from './logging.config';
import notificationsConfig from './notifications.config';
import rabbitmqConfig from './rabbitmq.config';
import redisConfig from './redis.config';
import securityConfig from './security.config';
import servicesConfig from './services.config';
import throttleConfig from './throttle.config';
import uploadConfig from './upload.config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env', '.env.local'],
			cache: true,
			expandVariables: true,
			load: [
				appConfig,
				databaseConfig,
				jwtConfig,
				redisConfig,
				rabbitmqConfig,
				uploadConfig,
				securityConfig,
				servicesConfig,
				throttleConfig,
				loggingConfig,
				healthcheckConfig,
				notificationsConfig,
			],
		}),
	],
})
export class ConfigurationModule {
}
