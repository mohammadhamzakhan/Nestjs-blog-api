import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { UserService } from './user.service';
import { getUser } from 'src/common/decorators/getUser.decorator';
import * as prisma from '@prisma/client';
import { updateUserDto } from './dto';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get('me')
    getCurrentUser(@getUser() user: prisma.User) {
        return this.userService.getCurrentUser(user.id);
    }
    @Patch('me')
    updateCurrentUser(@getUser('id') userId: number, @Body() dto: updateUserDto) {
        return this.userService.updateCurrentUser(userId, dto);
    }

    @Delete('me')
    deleteCurrentUser(@getUser('id') userId: number) {
        return this.userService.deleteCurrentUser(userId);



    }
    @Get('all')
    @Roles(prisma.Role.ADMIN)
    @UseGuards(RoleGuard)
    getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get(':id')
    @Roles(prisma.Role.ADMIN)
    @UseGuards(RoleGuard)
    getUserById(@Param('id', ParseIntPipe) userId: number) {
        return this.userService.getUserById(userId);
    }

    @Delete(':id')
    @Roles(prisma.Role.ADMIN)
    @UseGuards(RoleGuard)
    deleteUserById(@Param('id', ParseIntPipe) userId: number) {
        return this.userService.deleteUserById(userId);
    }


}
