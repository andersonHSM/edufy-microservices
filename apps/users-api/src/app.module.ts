import {Module} from '@nestjs/common';
import {UsersModule} from "src/app/users/users.module";
import {ConfigurationModule} from "src/libs/configuration/configuration.module";
import {DatabaseModule} from "src/libs/database/database.module";
import {AppController} from './app.controller';
import {AppService} from './app.service';

@Module({
	imports: [
		ConfigurationModule,
		UsersModule,
    DatabaseModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
}
