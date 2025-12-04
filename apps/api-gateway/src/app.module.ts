import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import configuration from "./libs/config/configuration";
import {UsersModule} from './app/users/users.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
			envFilePath: [".env", ".env.local"],
			cache: true,
			expandVariables: true,
		}),
		ClientsModule.registerAsync({
			isGlobal: true, clients: [{
				name: 'AUTH_API_SERVICE',
				inject: [ConfigService],
				useFactory: (configService: ConfigService) => ({
					transport: Transport.TCP,
					options: {
						host: configService.get('authService.host'),
						port: configService.get('authService.port')
					}
				})
			}]
		}),
		UsersModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
}
