import { Module } from '@nestjs/common';
import { AuthModule } from './module/auth/auth.module';
import { BlogModule } from './module/blog/blog.module';
import { PrismaModule } from './module/prisma/prisma.module';
import { UserModule } from './module/user/user.module';
import { SeederService } from './seeder/seeder.service';
import { UploadsModule } from './module/uploads/uploads.module';
import { CommentsModule } from './module/comments/comments.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BlogModule,
    UserModule,
    UploadsModule,
    CommentsModule],
  providers: [SeederService],
})
export class AppModule { }
