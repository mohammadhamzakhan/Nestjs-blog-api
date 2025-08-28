import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserEntity } from '../auth/entities';
import { updateUserDto } from './dto';
import { Role } from 'generated/prisma';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async findByRole(role: Role) {
        return await this.prisma.user.findFirst({
            where: { role },
        });
    }
    //===========================ONLY FOR ADMINS================================
    async getAllUsers() {
        const users = await this.prisma.user.findMany();

        return users;

    }
    async getUserById(userId: number) {
        const user = this.prisma.user.findFirst({ where: { id: userId } });
        if (!user) throw new NotFoundException("User not found");
        return user;
    }
    async deleteUserById(userId: number) {
        await this.prisma.user.delete({ where: { id: userId } });
        return {
            message: "User Deleted",
        }
    }


    //===========================FOR ALL USERS================================
    async getCurrentUser(userId: number): Promise<UserEntity> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });

        return new UserEntity(user!);
    }

    async updateCurrentUser(
        userId: number,
        dto: updateUserDto,
    ): Promise<UserEntity> {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { ...dto },
        });

        return new UserEntity(user);
    }

    async deleteCurrentUser(userId: number) {
        await this.prisma.user.delete({ where: { id: userId } });

        return {
            success: 'User Delete Successfull',
        };
    }
}
