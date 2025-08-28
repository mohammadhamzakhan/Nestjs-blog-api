import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadDto } from './dto/upload.dto';

@Controller('uploads')
export class UploadsController {
    constructor(private readonly uploadService: UploadsService) { }
    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: UploadDto,
    ) {
        if (!file) throw new BadRequestException("File is required");

        const processedFile = await this.uploadService.validateAndProcessFile(file);

        //folder naming convention
        const folder = dto.type === 'blog' ? 'blog' : 'profile'

        const imageUrl = await this.uploadService.uploadImage(processedFile, folder);

        if (dto.entityID) {
            await this.uploadService.linkImageToEntity(dto.type, dto.entityID, imageUrl)
        }

        return {
            message: 'image uploaded',
            type: dto.type,
            entityId: dto.entityID ?? null,
            imageUrl,
        }
    }
}
