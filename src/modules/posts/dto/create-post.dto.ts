import { IsBoolean, IsNotEmpty, IsNumber, IsString, Length, Min } from "class-validator";

export class CreatePostDto {

    @IsString()
    @IsNotEmpty()
    @Length(3, 255)
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    @Length(3, 255)
    readonly subtitle: string;

    @IsString()
    @IsNotEmpty()
    readonly content: string;

    @IsBoolean()
    readonly published: boolean;

    @IsNumber()
    @Min(0)
    readonly views: number;

    @IsNumber()
    @Min(0)
    readonly likes: number;

    @IsNumber()
    @Min(0)
    readonly dislikes: number;

    @IsNumber()
    @Min(1)
    readonly idUser: number;
}
