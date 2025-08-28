import { IsString } from 'class-validator';

export class updateUserDto {
    @IsString()
    name: string;

    @IsString()
    email: string;
}
