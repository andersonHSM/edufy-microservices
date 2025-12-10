import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from 'src/app/users/application/users.service';
import { UserRoleAssignedEvent } from 'src/app/users/events/user-role-assigned.event';
import { LoginDto } from 'src/app/users/presentation/dto/login.dto';
import { SignupUserDto } from 'src/app/users/presentation/dto/signup-user.dto';
import { Public } from 'src/app/users/presentation/public.decorator';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @MessagePattern('create_user')
  create(@Payload() signupUserDto: SignupUserDto) {
    return this.usersService.create(signupUserDto);
  }

  @Public()
  @MessagePattern('auth_login')
  login(@Payload() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }

  @EventPattern('user_role_assigned')
  handleUserRoleAssigned(@Payload() data: UserRoleAssignedEvent) {
    return this.usersService.updateRole(data.sub_id, data.role);
  }
}
