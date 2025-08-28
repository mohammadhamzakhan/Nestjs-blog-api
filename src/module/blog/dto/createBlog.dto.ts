import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class CreateBlogDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    slug: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    @IsUrl({}, { message: "Image url must be a valid Url" })
    featureImageUrl: string;

}