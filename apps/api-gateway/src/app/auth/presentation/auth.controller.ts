import { Body, Controller, Post, UseFilters } from "@nestjs/common";
import { AuthService } from "src/app/auth/application/auth.service";
import { LoginDto } from "src/app/auth/presentation/dto/login.dto";
import { Public } from "src/app/users/presentation/public.decorator";
import { RpcToHttpExceptionFilter } from "src/libs/exception-filters/rpc-to-http.exception-filter";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseFilters(new RpcToHttpExceptionFilter())
  @Post("login")
  public login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
