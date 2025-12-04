import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import adminConfig from './admin.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [".env", ".env.local"],
			cache: true,
			expandVariables: true,
			isGlobal: true,
			load: [jwtConfig, adminConfig, databaseConfig],
		}),
	],
})
export class ConfigurationModule {
}
