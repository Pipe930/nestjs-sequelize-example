import { IsOptional, IsString } from "class-validator";


export class SearchUserDto {

    @IsString()
    @IsOptional()
    readonly username?: string;

    @IsOptional()
    @IsString()
    readonly email?: string;
}