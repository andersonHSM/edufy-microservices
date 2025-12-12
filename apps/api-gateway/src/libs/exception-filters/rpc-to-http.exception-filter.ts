import { Catch, HttpException, RpcExceptionFilter } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable } from "rxjs";

@Catch(RpcException)
export class RpcToHttpExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException): Observable<HttpException> {
    const { message = "Internal server error", code = 500 } =
      exception.getError() as {
        message: string;
        code: number;
      };

    throw new HttpException(message, code);
  }
}
