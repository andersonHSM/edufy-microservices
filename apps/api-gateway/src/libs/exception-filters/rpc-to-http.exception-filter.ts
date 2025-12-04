import {ArgumentsHost, Catch, HttpException, RpcExceptionFilter} from "@nestjs/common";
import {RpcException} from "@nestjs/microservices";
import {Response} from 'express';
import {Observable, of} from "rxjs";

@Catch(RpcException)
export class RpcToHttpExceptionFilter implements RpcExceptionFilter<RpcException> {
	catch(exception: RpcException, host: ArgumentsHost): Observable<Response> {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const {message, code} = exception.getError() as { message: string; code: number };

		return of(response.status(code).json(new HttpException(message, code)));


	}
}