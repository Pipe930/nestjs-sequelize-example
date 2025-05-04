import { IsOptional, IsString } from "class-validator";


export class SearchPostDto {

    @IsString()
    @IsOptional()
    readonly title?: string;

    @IsString()
    @IsOptional()
    readonly subtitle?: string;
}
