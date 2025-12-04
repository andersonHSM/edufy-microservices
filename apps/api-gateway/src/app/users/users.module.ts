import {Module} from '@nestjs/common';
import {UsersController} from 'src/app/users/presentation/users.controller';
import {UsersService} from 'src/app/users/users.service';

@Module({

	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {
}
