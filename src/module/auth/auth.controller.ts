import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, signUpDto } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    @HttpCode(HttpStatus.CREATED)
    @Post('signUp')
    async signUp(@Body() dto: signUpDto) {
        return this.authService.signUp(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('signIn')
    async signIn(@Body() dto: SignInDto) {
        return this.authService.signIn(dto);
    }
}
