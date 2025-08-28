import { ArgumentsHost, BadRequestException, Catch, ConflictException, ExceptionFilter } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        let error = new BadRequestException('Database Error');

        switch (exception.code) {
            case 'P2002':
                error = new ConflictException(
                    `${exception.meta?.target} already Exists`,
                );
                break;
            case 'P2025':
                error = new BadRequestException(
                    `${exception.meta?.target} Not found`
                );
                break;
        }

        response.status(error.getStatus()).json(error.getResponse());
    }


}