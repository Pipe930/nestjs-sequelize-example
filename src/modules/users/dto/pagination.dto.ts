import { Transform } from "class-transformer";
import { IsIn, IsNumber, IsOptional, Min } from "class-validator";


export class PaginationDto {

    @Transform(({value}) => parseInt(value))
    @IsNumber()
    @IsOptional()
    @Min(1)
    readonly page?: number;

    @Transform(({value}) => parseInt(value))
    @IsNumber()
    @IsOptional()
    @Min(1)
    readonly limit?: number;

    @IsOptional()
    readonly sortBy?: string;

    @IsOptional()
    @IsIn(["asc", "desc"])
    readonly order?: "asc" | "desc";
}