import { PartialType } from "@nestjs/mapped-types";
import { CommentDto } from "./comment.dto";

export class editCommentDto extends PartialType(CommentDto) { }