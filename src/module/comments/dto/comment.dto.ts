import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CommentDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50, { message: "Name must be at most 50 Character" })
    name: string;

    @IsOptional()
    @IsEmail({}, { message: "Invalid email address" })
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(3, { message: "Comment must be atleast 3 character long" })
    @MaxLength(500, { message: "Comment must not exceed 500 character" })
    comment: string
}