import { Injectable, OnModuleInit } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthService } from 'src/module/auth/auth.service';
import { UserService } from 'src/module/user/user.service';

@Injectable()
export class SeederService implements OnModuleInit {
    constructor(
        private userService: UserService,
        private authService: AuthService,
    ) { }
    async onModuleInit() {
        const admin = await this.userService.findByRole('ADMIN');
        if (!admin) {
            await this.authService.signUp({
                name: 'Hamza Ali',
                email: 'hamza@gmail.com',
                password: 'hamzaali',

                role: Role.ADMIN,
            });
            console.log('First Admin is created');
        }
    }
}
