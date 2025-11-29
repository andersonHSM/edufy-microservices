import {Module} from '@nestjs/common';
import {UsersController} from 'src/app/users/users/presentation/users.controller';
import {UsersService} from './users.service';

@Module({
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {
}
