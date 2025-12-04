import {CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException,} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {JwtService} from '@nestjs/jwt';
import {type Request} from 'express';
import {IncomingMessage} from 'http';
import {IS_PUBLIC_KEY} from './public.decorator';

@Injectable()
export class JwtGuard implements CanActivate {
	private readonly logger: Logger = new Logger(JwtGuard.name);

	constructor(
		private readonly jwtService: JwtService,
		private reflector: Reflector,
	) {
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			return true;
		}

		const request = this.getRequest(context);
		const token = this.getToken(request);

		if (!token) {
			return false;
		}

		try {
			request.sub = (await this.jwtService.verifyAsync<{ sub: string }>(token)).sub;
			return true
		} catch (e) {
			this.logger.error('JWT validation failed', e);
			throw new UnauthorizedException('Invalid JWT token');
		}
	}

	private getRequest(context: ExecutionContext) {
		return context.switchToHttp().getRequest<
			Request & IncomingMessage & { sub: string }
		>();
	}

	private getToken(request: Request): string {
		const authorization = request.headers['authorization'];
		if (!authorization || Array.isArray(authorization)) {
			throw new UnauthorizedException(
				'Authorization header is missing or malformed',
			);
		}
		const [_bearer, token] = authorization.split(' ');
		return token;
	}

}
