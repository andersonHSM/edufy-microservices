import {Module} from '@nestjs/common';
import {ConfigurationModule} from "src/libs/configuration/configuration.module";
import {AppController} from './app.controller';
import {AppService} from './app.service';

@Module({
	imports: [
		ConfigurationModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
}
