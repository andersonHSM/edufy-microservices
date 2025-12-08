import {Module} from '@nestjs/common';
import {ConfigType} from "@nestjs/config";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {USERS_SERVICE} from "src/app/users/users.constants";
import {UsersModule} from "src/app/users/users.module";
import {ConfigurationModule} from "src/libs/configuration/configuration.module";
import rabbitmqConfig from "src/libs/configuration/rabbitmq.config";
import usersServiceConfig from "src/libs/configuration/users-service.config";
import {DatabaseModule} from "src/libs/database/database.module";
import {AppController} from './app.controller';
import {AppService} from './app.service';

@Module({
	imports: [
		DatabaseModule,
		ConfigurationModule,
		UsersModule,
		ClientsModule.registerAsync([
			{
				name: USERS_SERVICE,
				useFactory: (
					rabbitConfig: ConfigType<typeof rabbitmqConfig>,
					usersConfig: ConfigType<typeof usersServiceConfig>,
				) => ({
					transport: Transport.RMQ,
					options: {
						urls: [rabbitConfig.url],
						queue: usersConfig.queue,
						queueOptions: {
							durable: false,
						},
					},
				}),
				inject: [rabbitmqConfig.KEY, usersServiceConfig.KEY],
			},
		]),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
}
