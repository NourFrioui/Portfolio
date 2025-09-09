import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsArray,
  IsIn,
  IsBoolean,
  IsNumber,
  IsMongoId,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Detailed project description',
    example: 'This project includes user authentication, payment processing...',
  })
  @IsOptional()
  @IsString()
  detailedDescription?: string;

  @ApiPropertyOptional({
    description: 'Category ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Main project image URL',
    example: 'https://example.com/project-image.jpg',
  })
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Additional project images',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({
    description: 'Technologies used in the project',
    example: ['React', 'Node.js', 'MongoDB'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies?: string[];

  @ApiPropertyOptional({
    description: 'Tags for the project',
    example: ['ecommerce', 'fullstack', 'nextjs'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Project features',
    example: ['User Authentication', 'Payment Integration'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({
    description: 'Project challenges faced',
    example: ['Scalability issues', 'Performance optimization'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  challenges?: string[];

  @ApiPropertyOptional({
    description: 'Solutions implemented',
    example: ['Implemented caching', 'Optimized database queries'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  solutions?: string[];

  @ApiPropertyOptional({
    description: 'Project URL',
    example: 'https://myproject.com',
  })
  @IsOptional()
  @IsUrl({ require_protocol: false })
  projectUrl?: string;

  @ApiPropertyOptional({
    description: 'GitHub repository URL',
    example: 'https://github.com/user/project',
  })
  @IsOptional()
  @IsUrl({ require_protocol: false })
  githubUrl?: string;

  @ApiPropertyOptional({
    description: 'Project status',
    example: 'completed',
    enum: ['planning', 'in-progress', 'completed', 'on-hold'],
  })
  @IsOptional()
  @IsIn(['planning', 'in-progress', 'completed', 'on-hold'])
  status?: string;

  @ApiPropertyOptional({
    description: 'Display order',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiPropertyOptional({
    description: 'Whether the project is featured',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the project is active/visible',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
