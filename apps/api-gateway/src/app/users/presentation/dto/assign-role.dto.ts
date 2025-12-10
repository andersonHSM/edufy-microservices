import { IsEnum, IsNotEmpty } from "class-validator";
import { UserRole, type UserRoleEnum } from "../../domain/user.role";

export class AssignRoleDto {
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRoleEnum;
}
