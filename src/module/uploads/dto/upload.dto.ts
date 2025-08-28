import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class UploadDto {
    @IsString()
    @IsIn(['blog', 'profile'], {
        message: "type must be either 'blog' or 'profile'"
    })
    type: 'blog' | 'profile';

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    entityID: number;
}