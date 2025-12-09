import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersService } from 'src/app/users/application/users.service';
import { UserRepository } from 'src/app/users/domain/user.repository';
import { KyselyUserRepository } from 'src/app/users/infrastructure/kysely.user.repository';
import { JwtGuard } from 'src/app/users/presentation/jwt.guard';
import { UsersController } from 'src/app/users/presentation/users.controller';
import { ConfiguredJwtModule } from 'src/libs/jwt/jwt.module';

@Module({
  imports: [ConfiguredJwtModule],
  controllers: [UsersController],
  providers: [
    {
      provide: UserRepository,
      useClass: KyselyUserRepository,
    },
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    UsersService,
  ],
})
export class UsersModule {}
