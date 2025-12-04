import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import configuration from "src/libs/config/configuration";
import adminConfig from './admin.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import webhookConfig from './webhook.config';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [".env", ".env.local"],
			cache: true,
			expandVariables: true,
			load: [configuration, jwtConfig, adminConfig, databaseConfig, webhookConfig],
		}),
	],
})
export class ConfigurationModule {
}
