import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDto, signUpDto } from './dto';
import { UserEntity } from './entities';
import * as argon from "argon2";
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './dto/auth.response';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
        private config: ConfigService,
        private jwt: JwtService,

    ) { }

    async signUp(dto: signUpDto): Promise<AuthResponse> {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        const hash = await argon.hash(dto.password, {
            type: argon.argon2id,
            memoryCost: 19456,
            timeCost: 2,
            parallelism: 1,

        });
        const user = await this.prisma.user.create({ data: { ...dto, password: hash } });

        const token = this.signToken(user.id, user.email);
        await this.updateRefreshToken(user.id, token.refreshToken);

        return {
            user: new UserEntity(user),

            accessToken: token.accessToken,
            refreshToken: token.refreshToken,

        }
    }

    async signIn(dto: SignInDto): Promise<AuthResponse> {

        const user = await this.prisma.user.findFirst({ where: { email: dto.email } });
        if (!user) throw new NotFoundException("User Not found");
        const comparePass = await argon.verify(user.password, dto.password)

        if (!comparePass) throw new ForbiddenException("Password not match");

        const token = this.signToken(user.id, user.email);
        await this.updateRefreshToken(user.id, token.refreshToken);
        return {
            user: new UserEntity(user),
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
        }
    }

    signToken(userId: number, email: string) {
        const aSecret = this.config.get<string>('JWT-SECRET') ?? 'SUPER-SECRET';
        const rSecret = this.config.get<string>('JWT-SECRETr-r') ?? 'SUPER-SECRET-r';
        const issuer = this.config.get<string>('JWT-ISSUER') ?? 'my-app';
        const audience = this.config.get<string>('JWT-AUDIENCE') ?? 'my-app-user';
        const payload = {
            sub: userId,
            email,
        }

        const accessToken = this.jwt.sign(payload, {
            expiresIn: '15m',
            secret: aSecret, issuer, audience,
        });
        const refreshToken = this.jwt.sign(payload, {
            expiresIn: '7d',
            secret: rSecret, issuer, audience,
        });
        return { accessToken, refreshToken };
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hash = await argon.hash(refreshToken);

        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRefreshTokon: hash }
        });
    }

    async refreshToken(refreshToken: string,) {
        //verify //
        const payload = await this.jwt.verifyAsync<{ sub: number, email: string }>(
            refreshToken, {
            secret: this.config.get<string>('JWT-SECRET-r') ?? 'SUPER-SECRET-r',
        });

        //get user and verify
        const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user || !user.hashedRefreshTokon) throw new ForbiddenException("Access Denied");

        const ok = await argon.verify(user.hashedRefreshTokon, refreshToken);
        if (!ok) throw new ForbiddenException("Not verified");

        //===Rotate token 
        const token = this.signToken(user.id, user.email);
        await this.updateRefreshToken(user.id, token.refreshToken);
        return token;
    }
}
