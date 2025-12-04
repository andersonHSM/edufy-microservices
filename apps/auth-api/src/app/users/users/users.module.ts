import {Module} from '@nestjs/common';
import {UsersController} from 'src/app/users/users/presentation/users.controller';
import {ConfiguredJwtModule} from "src/libs/jwt/jwt.module";
import {UsersService} from './users.service';

@Module({
	imports: [ConfiguredJwtModule],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {
}
