import {Module} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {APP_FILTER} from "@nestjs/core";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {ConfigurationModule} from "src/libs/configuration/configuration.module";
import {RpcToHttpExceptionFilter} from "src/libs/exception-filters/rpc-to-http.exception-filter";
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
	providers: [AppService, {provide: APP_FILTER,  useClass: RpcToHttpExceptionFilter}],
})
export class AppModule {
}
