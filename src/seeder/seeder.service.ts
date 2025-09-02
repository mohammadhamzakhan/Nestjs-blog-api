import { Injectable, OnModuleInit } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/module/prisma/prisma.service';
import * as argon from "argon2";

@Injectable()
export class SeederService implements OnModuleInit {
    constructor(
        private prisma: PrismaService,

    ) { }
    async onModuleInit() {

        await this.prisma.user.upsert({
            where: { email: 'hamza@gmail.com' },
            update: {},
            create: {
                name: 'Hamza Ali',
                email: 'hamza@gmail.com',
                password: await argon.hash('hamzaali', {
                    type: argon.argon2d,
                }),

                role: Role.ADMIN,
            }
        });
        console.log('First Admin is created');

    }
}
