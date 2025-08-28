import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';
import sharp from 'sharp';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';

@Injectable()
export class UploadsService {
    constructor(config: ConfigService, private readonly prisma: PrismaService) {
        cloudinary.config({
            cloud_name: config.get<string>('CLOUD_NAME'),
            api_key: config.get<string>('API_KEY'),
            api_secret: config.get<string>('API_SECRET'),
        })
    }

    async uploadImage(
        file: Express.Multer.File,
        folder: string): Promise<any> {
        try {
            return new Promise((resolve, rejects) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder,
                        resource_type: 'image',
                        transformation: [{ quality: 'auto', fetch_format: 'auto' }]
                    },
                    (
                        error: UploadApiErrorResponse,
                        result: UploadApiResponse | undefined,

                    ) => {
                        if (error) return rejects(error)
                        resolve(result?.secure_url);
                    }
                ).end(file.buffer);
            })
        } catch (error) {
            throw new InternalServerErrorException("Image upload failed");

        }
    }

    async linkImageToEntity(type: 'blog' | 'profile', entityId: number, imageUrl: string) {
        if (!entityId) throw new BadRequestException("Entity id is required");

        if (type === 'blog') {
            await this.prisma.blog.update({
                where: { id: entityId },
                data: { featureImageUrl: imageUrl },
            });
        }
        if (type === 'profile') {
            await this.prisma.user.update({
                where: { id: entityId },
                data: { profileImageUrl: imageUrl }
            })
        }
    }
    async validateAndProcessFile(file: Express.Multer.File): Promise<Express.Multer.File> {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new BadRequestException("Invalid Image Type");

        }
        //if file is greater than 1 mb then it will be compressed
        if (file.size > 1 * 1024 * 1024) {
            const compressedBuffer = await sharp(file.buffer).
                resize({ width: 1200 })
                .jpeg({ quality: 80 })
                .toBuffer();

            //overrite the file buffer and size
            file.buffer = compressedBuffer;
            file.size = compressedBuffer.length;
            file.mimetype = 'image/jpeg';

            //this is optional for debugginhg saving in the uploads folder 

            const tempPath = join(process.cwd(), 'uploads/images');
            await fs.mkdir(tempPath, { recursive: true });
            const fileName = randomUUID() + '.jpeg';
            const filePath = join(tempPath, fileName);
            await fs.writeFile(filePath, compressedBuffer);
        }
        return file;
    }
}
