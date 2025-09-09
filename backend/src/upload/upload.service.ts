import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  private readonly uploadPath = './uploads';
  private readonly publicPath = './public/images';
  private readonly pdfPath = './uploads/pdfs';
  private readonly baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadPath);
    } catch {
      await fs.mkdir(this.uploadPath, { recursive: true });
    }
  }

  async ensurePublicDirectory(): Promise<void> {
    try {
      await fs.access(this.publicPath);
    } catch {
      await fs.mkdir(this.publicPath, { recursive: true });
    }
  }

  async ensurePdfDirectory(): Promise<void> {
    try {
      await fs.access(this.pdfPath);
    } catch {
      await fs.mkdir(this.pdfPath, { recursive: true });
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
    return `${this.baseUrl}/uploads/${filename}`;
  }

  getPublicImageUrl(filename: string): string {
    return `${this.baseUrl}/images/${filename}`;
  }

  getPublicPdfUrl(filename: string): string {
    return `${this.baseUrl}/pdfs/${filename}`;
  }

  async saveProfileImage(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    await this.ensurePublicDirectory();

    const fileExtension = file.originalname.split('.').pop() || 'jpg';
    const filename = `profile-${userId}-${randomUUID()}.${fileExtension}`;
    const filePath = join(this.publicPath, filename);

    await fs.writeFile(filePath, file.buffer);
    return filename;
  }

  async deleteProfileImage(filename: string): Promise<void> {
    try {
      const filePath = join(this.publicPath, filename);
      await fs.unlink(filePath);
    } catch (error) {
      console.warn(`Failed to delete profile image ${filename}:`, error);
    }
  }

  async savePdfFile(
    file: Express.Multer.File,
    userId?: string,
  ): Promise<string> {
    await this.ensurePdfDirectory();

    const fileExtension = file.originalname.split('.').pop() || 'pdf';
    const filename = userId
      ? `cv-${userId}-${randomUUID()}.${fileExtension}`
      : `${randomUUID()}.${fileExtension}`;
    const filePath = join(this.pdfPath, filename);

    await fs.writeFile(filePath, file.buffer);
    return filename;
  }

  getPdfUrl(filename: string): string {
    return `${this.baseUrl}/upload/pdfs/${filename}`;
  }

  async deletePdf(filename: string): Promise<void> {
    try {
      const filePath = join(this.pdfPath, filename);
      await fs.unlink(filePath);
    } catch (error) {
      console.warn(`Failed to delete pdf ${filename}:`, error);
    }
  }

  validateFile(file: Express.Multer.File): boolean {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
    ];
    return allowedMimes.includes(file.mimetype);
  }
}
