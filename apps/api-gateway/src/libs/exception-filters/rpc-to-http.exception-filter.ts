import {ArgumentsHost, Catch, HttpException, RpcExceptionFilter} from "@nestjs/common";
import {RpcException} from "@nestjs/microservices";
import {Observable, throwError} from "rxjs";

@Catch(RpcException)
export class RpcToHttpExceptionFilter implements RpcExceptionFilter<RpcException> {
	catch(exception: RpcException, host: ArgumentsHost): Observable<HttpException> {
		const {message, code} = exception.getError() as { message: string; code: number };
		throw new HttpException(message, code);
	}
}