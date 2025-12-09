import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError, throwError, timeout } from "rxjs";
import { AUTH_SERVICE } from "src/app/auth/auth.constants";
import { SignupUserDto } from "src/app/users/presentation/dto/signup-user.dto";
import { USERS_TCP_SERVICE } from "src/app/users/users.constants";

@Injectable()
export class UsersService {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClientProxy: ClientProxy,
    @Inject(USERS_TCP_SERVICE)
    private readonly usersTcpClientProxy: ClientProxy,
  ) {}

  public createUser(body: SignupUserDto) {
    return this.authClientProxy.send("createUser", body).pipe(
      timeout(5000),
      catchError((err) => {
        return throwError(() => new RpcException(err));
      }),
    );
  }

  public getUserById(subId: string) {
    return this.usersTcpClientProxy.send("getUserById", subId);
  }
}
