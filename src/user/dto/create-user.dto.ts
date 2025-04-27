import { IsString, IsStrongPassword, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    userName: string;

    @MinLength(6, { message: 'Password must be more than 6 symbols' })
    password: string;
}