import { IsBoolean, IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    @Length(3, 60)
    readonly username: string;

    @IsEmail()
    @IsNotEmpty()
    @Length(3, 255)
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 32)
    readonly password: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 32)
    readonly rePassword: string;

    @IsBoolean()
    readonly active: boolean;

    @IsBoolean()
    readonly isStaff: boolean;

    @IsBoolean()
    readonly isSuperuser: boolean;
}
