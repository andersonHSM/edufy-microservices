import {Module} from '@nestjs/common';
import {UsersModule} from "src/app/users/users/users.module";
import {ConfigurationModule} from "src/libs/configuration/configuration.module";
import {AppController} from './app.controller';
import {AppService} from './app.service';

@Module({
	imports: [
		ConfigurationModule,
		UsersModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
}
