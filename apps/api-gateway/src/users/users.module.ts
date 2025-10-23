import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {UsersController} from './presentation/users.controller';
import {UsersService} from './users.service';

@Module({
	controllers: [UsersController],
	imports: [ClientsModule.registerAsync([
		{
			imports: [ConfigModule],
			inject: [ConfigService],
			name: 'AUTH_SERVICE_CLIENT',
			useFactory: async (configService: ConfigService) => {
				const PORT = configService.get("AUTH_SERVICE_PORT", "3001");
				return {
					transport: Transport.TCP,
					options: {
						port: parseInt(PORT, 10),
					}
				}
			}
		}
	])],
	providers: [UsersService],
})
export class UsersModule {
}
