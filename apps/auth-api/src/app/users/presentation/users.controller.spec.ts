import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/app/users/application/users.service';
import { UsersController } from 'src/app/users/presentation/users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
