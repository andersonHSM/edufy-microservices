import {Module} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {ConfigurationModule} from "src/libs/configuration/configuration.module";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {UsersModule} from './app/users/users.module';

@Module({
	imports: [
		ConfigurationModule,
		ClientsModule.registerAsync({
			isGlobal: true,
			clients: [
				{
					name: 'AUTH_API_SERVICE',
					inject: [ConfigService],
					useFactory: (configService: ConfigService) => ({
						transport: Transport.TCP,
						options: {
							host: configService.get('authService.host'),
							port: configService.get('authService.port')
						}
					})
				}
			]
		}),
		UsersModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
}
