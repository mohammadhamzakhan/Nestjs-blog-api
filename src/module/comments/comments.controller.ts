import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Req,
    UseGuards
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentDto, editCommentDto } from './dto';
import { JwtGuard, OptionalGuard, RoleGuard } from 'src/common/guards';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';


@Controller('comments')
export class CommentsController {
    constructor(private commentService: CommentsService) {

    }
    @UseGuards(OptionalGuard)
    @Post(':id')
    async createComment(
        @Param('id', ParseIntPipe) blogId: number,
        @Body() dto: CommentDto,

        @Req() req: Request & { user: { id: number } }
    ) {
        const userId = req?.user?.id ?? null;
        console.log(userId);

        return await this.commentService.createComment(blogId, dto, userId)
    }

    @Get(':id')
    async getComments(@Param('id', ParseIntPipe) blogId: number,) {
        return this.commentService.findAll(blogId)
    }
    @UseGuards(JwtGuard)
    @Patch(':id')
    async editComment(
        @Param('id', ParseIntPipe) commentId: number,
        @Body() dto: editCommentDto,
        @Req() req: Request & { user: { id: number } }) {
        const userId = req.user.id;
        console.log(userId);
        return this.commentService.editComment(commentId, dto, userId)
    }
    @UseGuards(JwtGuard)
    @Delete(':id')
    async deleteComment(
        @Param('id', ParseIntPipe) commentId: number,
        @Req() req: Request & { user: { id: number } }
    ) {
        const userId = req.user.id;

        return this.commentService.deleteComment(commentId, userId);
    }
    @UseGuards(JwtGuard)
    @Delete('all/:id')
    async deleteAllComments(
        @Param('id', ParseIntPipe) blogId: number,
        @Req() req: Request & { user: { id: number } }
    ) {
        const userId = req.user.id;
        return this.commentService.deleteAllComment(blogId, userId);
    }
    @Delete('admin/:id')
    @Roles(Role.ADMIN)
    @UseGuards(RoleGuard)
    @UseGuards(JwtGuard)
    async deleteAllByAdmin(
        @Param('id', ParseIntPipe) blogId: number,

    ) {
        return this.commentService.adminDeleteAll(blogId);
    }

}
