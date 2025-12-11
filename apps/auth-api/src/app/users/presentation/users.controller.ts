import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
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

  @MessagePattern('validate_user_exists_and_role')
  async validateUserExistsAndRole(
    @Payload() data: { sub_id: string; role?: string },
  ) {
    const user = await this.usersService.validateUserExistsAndRole(
      data.sub_id,
      data.role,
    );
    return { sub_id: user.sub, email: user.email, role: user.role };
  }

  @EventPattern('user_role_assigned')
  async handleUserRoleAssigned(
    @Payload() data: UserRoleAssignedEvent,
    @Ctx() context: RmqContext,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.usersService.updateRole(data.sub_id, data.role);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      channel.ack(originalMsg);
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      channel.nack(originalMsg, false, false);
    }
  }
}
