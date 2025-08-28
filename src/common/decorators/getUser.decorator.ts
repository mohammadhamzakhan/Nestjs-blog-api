import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";
import { User } from "generated/prisma";

export const getUser = createParamDecorator(
    (data: keyof User | undefined, ctx: ExecutionContext): Partial<User> | User[keyof User] => {
        const request = ctx.switchToHttp().getRequest()
        const user: User = request.user;
        if (!user) {
            throw new NotFoundException("User not found");
        }
        if (data) {
            return user[data];
        }
        return user;
    }
)