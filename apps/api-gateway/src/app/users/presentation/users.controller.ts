import { Body, Controller, Get, Param, Post, UseFilters } from "@nestjs/common";
import { UsersService } from "src/app/users/application/users.service";
import { SignupUserDto } from "src/app/users/presentation/dto/signup-user.dto";
import { Public } from "src/app/users/presentation/public.decorator";
import { RpcToHttpExceptionFilter } from "src/libs/exception-filters/rpc-to-http.exception-filter";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @UseFilters(new RpcToHttpExceptionFilter())
  @Post("")
  public createUser(@Body() body: SignupUserDto) {
    return this.usersService.createUser(body);
  }

  @Get(":subId")
  public getUserById(@Param("subId") subId: string) {
    return this.usersService.getUserById(subId);
  }
}
