import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {UsersModule} from "src/app/users/users/users.module";
import {AppController} from './app.controller';
import {AppService} from './app.service';
import configuration from './config/configuration';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
			envFilePath: ['.env', '.env.local'],
			cache: true,
			expandVariables: true,
		}),
		UsersModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
}
