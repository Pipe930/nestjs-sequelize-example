import { IsBoolean, IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateUserDto {

    @IsString()
    @IsNotEmpty()
    @Length(3, 60)
    readonly username: string;

    @IsEmail()
    @IsNotEmpty()
    @Length(3, 255)
    readonly email: string;

    @IsBoolean()
    readonly active: boolean;

    @IsBoolean()
    readonly isStaff: boolean;

    @IsBoolean()
    readonly isSuperuser: boolean;
}
