import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { UserRole, type UserRoleEnum } from "../../domain/user.role";

export class AssignRoleDto {
  @ApiProperty({
    description: "The role to assign to the user",
    enum: UserRole,
    enumName: "UserRole",
    example: UserRole.Instructor,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRoleEnum;
}
