import {Module} from '@nestjs/common';
import {UsersService} from 'src/app/users/application/users.service';
import {UsersController} from 'src/app/users/presentation/users.controller';
import {ConfiguredJwtModule} from "src/libs/jwt/jwt.module";

@Module({
	imports: [ConfiguredJwtModule],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {
}
