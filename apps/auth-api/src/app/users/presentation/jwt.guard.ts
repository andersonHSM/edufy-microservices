import {CanActivate, ExecutionContext, Inject, Injectable, Logger,} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {JwtService} from '@nestjs/jwt';
import {RpcException} from "@nestjs/microservices";
import {type Request} from 'express';
import {IncomingMessage} from 'http';
import {UserEntity} from '../domain/user.entity';
import {type IUserRepository, UserRepository} from '../domain/user.repository';
import {IS_PUBLIC_KEY} from './public.decorator';

@Injectable()
export class JwtGuard implements CanActivate {
	private readonly logger: Logger = new Logger(JwtGuard.name);

	constructor(
		private readonly jwtService: JwtService,
		@Inject(UserRepository)
		private readonly userRepository: IUserRepository,
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
			request.user = await this.getUserFromToken(token);
			return true;
		} catch (e) {
			this.logger.error('JWT validation failed', e);
			throw new RpcException({message: 'Invalid JWT token', code: 401});
		}
	}

	private getRequest(context: ExecutionContext) {
		return context.switchToHttp().getRequest<
			Request & IncomingMessage & {
			user?: UserEntity | null;
		}
		>();
	}

	private getToken(request: Request): string {
		const authorization = request.headers['authorization'];
		if (!authorization || Array.isArray(authorization)) {
			throw new RpcException(
				{message: 'Authorization header is missing or malformed', code: 401},
			);
		}
		const [_bearer, token] = authorization.split(' ');
		return token;
	}

	private async getUserFromToken(token: string): Promise<UserEntity | null> {
		const userId = this.jwtService.verify<{ sub: string }>(token);
		return await this.userRepository.findOneById(userId.sub);
	}
}
