import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import adminConfig from './admin.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import rabbitmqConfig from './rabbitmq.config';
import usersServiceConfig from "src/libs/configuration/users-service.config";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [".env", ".env.local"],
			cache: true,
			expandVariables: true,
			isGlobal: true,
			load: [jwtConfig, adminConfig, databaseConfig, rabbitmqConfig, usersServiceConfig],
		}),
	],
})
export class ConfigurationModule {
}
