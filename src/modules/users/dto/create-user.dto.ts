import { Roles } from "@core/enums/role.enum";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString, Length } from "class-validator";

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

    @IsEnum(Roles)
    readonly role: Roles;
}
