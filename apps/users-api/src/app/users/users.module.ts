import { Module } from '@nestjs/common';
import { UsersService } from 'src/app/users/application/users.service';
import { UserRepository } from 'src/app/users/domain/user.repository';
import { KyselyUserRepository } from 'src/app/users/infrastructure/kysely.user.repository';
import { UsersController } from 'src/app/users/presentation/users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: UserRepository,
      useClass: KyselyUserRepository,
    },
  ],
})
export class UsersModule {}
