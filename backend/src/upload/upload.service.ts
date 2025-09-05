import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class UploadService {
  private readonly uploadPath = './uploads';

  async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadPath);
    } catch {
      await fs.mkdir(this.uploadPath, { recursive: true });
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      const filePath = join(this.uploadPath, filename);
      await fs.unlink(filePath);
    } catch (error) {
      console.warn(`Failed to delete file ${filename}:`, error);
    }
  }

  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  }

  validateFile(file: Express.Multer.File): boolean {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    return allowedMimes.includes(file.mimetype);
  }
}
