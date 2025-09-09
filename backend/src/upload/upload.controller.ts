import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
  Param,
  Res,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { join } from 'path';
import { UploadService } from './upload.service';
import { memoryStorage } from 'multer';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const isValid = this.uploadService.validateFile(file);
    if (!isValid) {
      throw new BadRequestException(
        'Invalid file type. Only images are allowed.',
      );
    }

    await this.uploadService.ensureUploadDirectory();

    return {
      message: 'File uploaded successfully',
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: this.uploadService.getFileUrl(file.filename),
    };
  }

  @Post('profile-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const isValid = this.uploadService.validateFile(file);
    if (!isValid) {
      throw new BadRequestException(
        'Invalid file type. Only images are allowed.',
      );
    }

    const filename = await this.uploadService.saveProfileImage(file, userId);

    return {
      message: 'Profile image uploaded successfully',
      filename,
      originalName: file.originalname,
      size: file.size,
      url: this.uploadService.getPublicImageUrl(filename),
    };
  }

  @Post('pdf')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(new Error('Only PDF files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  async uploadPdf(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const filename = await this.uploadService.savePdfFile(file, userId);

    return {
      message: 'PDF uploaded successfully',
      filename,
      originalName: file.originalname,
      size: file.size,
      url: this.uploadService.getPdfUrl(filename),
    };
  }

  @Get(':filename')
  serveFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', filename);
    return res.sendFile(filePath);
  }

  @Get('images/:filename')
  servePublicImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'public', 'images', filename);
    return res.sendFile(filePath);
  }

  @Get('pdfs/:filename')
  servePdf(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', 'pdfs', filename);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    return res.sendFile(filePath);
  }
}
