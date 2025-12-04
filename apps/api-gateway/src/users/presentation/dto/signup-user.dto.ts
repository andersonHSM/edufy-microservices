import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, MinLength} from 'class-validator';

export class SignupUserDto {
	@ApiProperty()
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@MinLength(8)
	password: string;
}
