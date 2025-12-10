import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
} from "@nestjs/common";
import { UsersService } from "src/app/users/application/users.service";
import { AssignRoleDto } from "src/app/users/presentation/dto/assign-role.dto";
import { SignupUserDto } from "src/app/users/presentation/dto/signup-user.dto";
import { UpdateUserDto } from "src/app/users/presentation/dto/update-user.dto";
import { Public } from "src/app/users/presentation/public.decorator";
import { RpcToHttpExceptionFilter } from "src/libs/exception-filters/rpc-to-http.exception-filter";
import { CurrentUser } from "./current-user.decorator";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @UseFilters(new RpcToHttpExceptionFilter())
  @Post("")
  public createUser(@Body() body: SignupUserDto) {
    return this.usersService.createUser(body);
  }

  @Get("me")
  public getMe(@CurrentUser() user: any) {
    return this.usersService.getUserById(user.sub);
  }

  @Patch("me")
  public updateUser(@CurrentUser() user: any, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(user.sub, body);
  }

  @Post("me/role")
  public assignRole(@CurrentUser() user: any, @Body() body: AssignRoleDto) {
    return this.usersService.assignRole(user.sub, body.role);
  }

  @Get(":subId")
  public getUserById(@Param("subId") subId: string) {
    return this.usersService.getUserById(subId);
  }
}
