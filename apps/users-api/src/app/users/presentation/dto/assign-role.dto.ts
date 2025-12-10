import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole, type UserRoleEnum } from 'src/app/users/domain/user.role';

export class AssignRoleDto {
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRoleEnum;
}
