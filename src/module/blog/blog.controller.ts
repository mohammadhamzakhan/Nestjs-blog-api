import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { getUser } from 'src/common/decorators/getUser.decorator';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { CreateBlogDto } from './dto';
import { UpdateBlogDto } from './dto/updateBlog.dto';
import { Role } from "@prisma/client";
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';

@UseGuards(JwtGuard)
@Controller('blog')
export class BlogController {
    constructor(private blogService: BlogService) { }

    //==>==>==>==>FOR ALL USERS<==<==<==<==
    @HttpCode(HttpStatus.CREATED)
    @Post('create')
    createBlog(@Body() dto: CreateBlogDto, @getUser('id', ParseIntPipe) authorId: number) {
        return this.blogService.createBlog(authorId, dto);
    }
    @HttpCode(HttpStatus.OK)
    @Get('me')
    getBlogs(@getUser('id', ParseIntPipe) authorId: number) {
        return this.blogService.getBlogs(authorId);
    }
    @HttpCode(HttpStatus.OK)
    @Get('me/:id')
    getSingleBlog(@getUser('id', ParseIntPipe) authorId: number, @Param('id', ParseIntPipe) id: number) {
        return this.blogService.getSingleBlog(id, authorId);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('me/:id')
    deleteBlog(@getUser('id', ParseIntPipe) authorId: number, @Param('id', ParseIntPipe) id: number) {
        return this.blogService.deleteBlog(id, authorId);
    }
    @HttpCode(HttpStatus.OK)
    @Patch('me/:id')
    updateBlog(
        @getUser('id', ParseIntPipe) authorId: number,
        @Body() dto: UpdateBlogDto,
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.blogService.updateBlog(id, authorId, dto);
    }

    //==>==>==>==>FOR ADMINS ONLY<==<==<==<==
    @HttpCode(HttpStatus.OK)
    @Get('getB/:id')
    @Roles(Role.ADMIN)
    @UseGuards(RoleGuard)
    getBlogById(@Param('id', ParseIntPipe) blogId: number) {
        return this.blogService.getBlogById(blogId);
    }
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('getB/:id')
    @Roles(Role.ADMIN)
    @UseGuards(RoleGuard)
    deleteBlogById(@Param('id', ParseIntPipe) blogId: number) {
        return this.blogService.deleteBlogById(blogId);
    }
    @HttpCode(HttpStatus.OK)
    @Patch('getB/:id')
    @Roles(Role.ADMIN)
    @UseGuards(RoleGuard)
    editBlogById(@Param('id', ParseIntPipe) blogId: number, @Body() dto: UpdateBlogDto) {
        return this.blogService.editBlogById(blogId, dto);
    }

}