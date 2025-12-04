import {Module} from '@nestjs/common';
import {UsersController} from 'src/app/users/presentation/users.controller';
import {UsersService} from 'src/app/users/users.service';
import {ConfiguredJwtModule} from "src/libs/jwt/jwt.module";

@Module({
	imports: [ConfiguredJwtModule],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {
}
