import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UsersService } from "src/app/users/application/users.service";
import { AssignRoleDto } from "src/app/users/presentation/dto/assign-role.dto";
import { SignupUserDto } from "src/app/users/presentation/dto/signup-user.dto";
import { UpdateUserDto } from "src/app/users/presentation/dto/update-user.dto";
import { Public } from "src/app/users/presentation/public.decorator";
import { RpcToHttpExceptionFilter } from "src/libs/exception-filters/rpc-to-http.exception-filter";
import { CurrentUser } from "./current-user.decorator";

@Controller("users")
@UseFilters(new RpcToHttpExceptionFilter())
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post("")
  public createUser(@Body() body: SignupUserDto) {
    return this.usersService.createUser(body);
  }

  @Get("me")
  public getMe(@CurrentUser() userSub: string) {
    return this.usersService.getUserById(userSub);
  }

  @Patch("me")
  public updateUser(
    @CurrentUser() userSub: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.usersService.updateUser(userSub, body);
  }

  @Post("me/role")
  public assignRole(
    @CurrentUser() userSub: string,
    @Body() body: AssignRoleDto,
  ) {
    return this.usersService.assignRole(userSub, body.role);
  }

  @Get(":subId")
  public getUserById(@Param("subId") subId: string) {
    return this.usersService.getUserById(subId);
  }
}
