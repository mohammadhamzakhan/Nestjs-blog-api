import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/module/prisma/prisma.service";
import { UserEntity } from "../entities";
import { ForbiddenException, Injectable } from "@nestjs/common";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>('JWT-SECRET') ?? 'SUPER-SECRET',
            issuer: config.get<string>('JWT-ISSUER') ?? 'my-app',
            audience: config.get<string>('JWT-AUDIENCE') ?? 'my-app-user'
        })
    }
    async validate(payload: {
        sub: number,
        email: string,
    }): Promise<UserEntity> {
        const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });

        if (!user) {
            throw new ForbiddenException("User Not Found");
        }

        return new UserEntity(user)

    }

}