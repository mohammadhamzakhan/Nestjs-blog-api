import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto';
import { UpdateBlogDto } from './dto/updateBlog.dto';

@Injectable()
export class BlogService {
    constructor(private prisma: PrismaService) { }
    //====================For Admin Only====================

    // //==>Get Blog by ID
    async getBlogById(blogId: number) {
        const blog = await this.prisma.blog.findUnique({ where: { id: blogId } })
        if (!blog) throw new NotFoundException(`No blog found with ID ${blogId}`)
        return blog;
    }

    //==>Delete Blog by ID
    async deleteBlogById(blogId: number) {
        const blog = await this.prisma.blog.delete({ where: { id: blogId } });
        if (!blog) throw new NotFoundException(`No blog found with ID ${blogId}`)
        return { message: "Deleted Succesfully" }
    }

    //==>Edit Blog by ID
    async editBlogById(blogId: number, dto: UpdateBlogDto) {
        const blog = await this.prisma.blog.findFirst({ where: { id: blogId } });

        if (!blog) throw new NotFoundException("Blog not found");
        const updatedBlog = await this.prisma.blog.update({ where: { id: blogId }, data: { ...dto } })
        return updatedBlog;
    }


    //====================For All Users====================

    //==>Create Blog
    async createBlog(authorId: number, dto: CreateBlogDto) {
        const blog = await this.prisma.blog.create({ data: { ...dto, authorId } })
        return blog;
    }

    //==>Get Blogs
    async getBlogs(authorId: number) {
        const blogs = await this.prisma.blog.findMany({ where: { authorId } });
        if (blogs.length === 0) throw new NotFoundException('No Blogs Found!!! Create your blog');
        return blogs;
    }

    //==>Get Single Blog
    async getSingleBlog(blogId: number, authorId: number) {
        const blog = await this.prisma.blog.findFirst({ where: { id: blogId, authorId } });
        if (!blog) throw new NotFoundException(`No Blog found with ID ${blogId} `);
        return blog;
    }

    //==>Edit Blog by ID
    async updateBlog(blogId: number, authorId: number, dto: UpdateBlogDto) {
        const blog = await this.prisma.blog.findFirst({ where: { id: blogId } });
        if (!blog) throw new NotFoundException(`Blog not found with ID ${blogId}`);

        const updatedBlog = await this.prisma.blog.update({ where: { id: blogId, authorId }, data: { ...dto } });
        return updatedBlog;
    }

    //==>Delete Blog by ID
    async deleteBlog(blogId: number, authorId: number) {
        const blog = await this.prisma.blog.findFirst({ where: { id: blogId, authorId } });
        if (!blog) throw new NotFoundException(`No Blog found with ID ${blogId} `);
        await this.prisma.blog.delete({ where: { id: blogId } })
        return { message: "Deleted Succesfully" }

    }
}
