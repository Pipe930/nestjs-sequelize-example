import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    @Length(3, 60)
    @Transform(({value}) => value.trim())
    readonly username: string;

    @IsEmail()
    @IsNotEmpty()
    @Length(3, 255)
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 32)
    @Transform(({value}) => value.trim())
    readonly password: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 32)
    @Transform(({value}) => value.trim())
    readonly rePassword: string;

    @IsBoolean()
    readonly active: boolean;

    @IsBoolean()
    readonly isStaff: boolean;

    @IsBoolean()
    readonly isSuperuser: boolean;
}
