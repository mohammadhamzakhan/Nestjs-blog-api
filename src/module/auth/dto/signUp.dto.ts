import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { Role } from "@prisma/client";

export class signUpDto {

    @IsNotEmpty()
    @Length(6)
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(4)
    password: string;

    @IsOptional()
    role: Role



}