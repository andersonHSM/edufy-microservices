import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError, throwError, timeout } from "rxjs";
import { AUTH_SERVICE } from "src/app/auth/auth.constants";
import { LoginDto } from "src/app/auth/presentation/dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClientProxy: ClientProxy,
  ) {}

  public login(loginDto: LoginDto) {
    return this.authClientProxy.send("auth_login", loginDto).pipe(
      timeout(5000),
      catchError((err) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return throwError(() => new RpcException(err));
      }),
    );
  }
}
