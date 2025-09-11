import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class updateUserDto {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    @IsUrl({}, { message: "Image url must be a valid Url" })
    featureImageUrl: string;
}
