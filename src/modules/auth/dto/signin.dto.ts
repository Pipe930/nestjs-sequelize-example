import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class SignInDto {

    @IsEmail()
    @Length(3, 255)
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @Length(8, 32)
    @IsNotEmpty()
    readonly password: string;
}