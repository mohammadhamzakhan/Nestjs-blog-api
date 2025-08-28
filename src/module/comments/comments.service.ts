import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommentDto, editCommentDto } from './dto';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) { }

    //create comment
    async createComment(blogId: number, dto: CommentDto, userId?: number | null) {

        if (userId) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (!user) throw new NotFoundException("User not found");
        }
        const comment = await this.prisma.comments.create({ data: { blogId, ...dto, userId } });

        return comment;
    }
    async findAll(blogId: number) {
        const comment = await this.prisma.comments.findMany({ where: { blogId } });

        if (comment.length === 0) throw new NotFoundException("Comment not found or deleted");
        return comment;
    }


    //edit comment
    async editComment(commentId: number, dto: editCommentDto, userId: number) {
        const comment = await this.prisma.comments.findUnique({ where: { id: commentId } });

        if (!comment) throw new NotFoundException("Comment not found or deleted");

        if (comment.userId !== userId) {
            throw new ForbiddenException("you are not allowd to perform this action")
        }
        const updated = await this.prisma.comments.update({ where: { id: comment.id }, data: { ...dto } });
        return updated;
    }

    //delete comment
    async deleteComment(commentId: number, userId: number) {
        const comment = await this.prisma.comments.findUnique({ where: { id: commentId } });

        if (!comment) throw new NotFoundException("Comment not found or deleted");


        await this.prisma.comments.delete({ where: { id: comment.id } });
        return { message: 'comment deleted' }
    }

    //delete All
    async deleteAllComment(blogId: number, userId: number) {

        const result = await this.prisma.comments.deleteMany({ where: { blogId, userId } });

        return {
            message: `${result.count} comments deleted`
        }
    }
    //delete All
    async adminDeleteAll(blogId: number) {

        const result = await this.prisma.comments.deleteMany({ where: { blogId } });

        return {
            message: `${result.count} comments deleted`
        }
    }

}
