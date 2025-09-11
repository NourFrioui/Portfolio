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

  @ApiPropertyOptional({ description: 'Long description' })
  @IsOptional()
  @IsString()
  longDescription?: string;

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

  @ApiPropertyOptional({ description: 'Live URL' })
  @IsOptional()
  @IsUrl({ require_protocol: false })
  liveUrl?: string;

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

  @ApiPropertyOptional({ description: 'Start date' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Team size' })
  @IsOptional()
  @IsNumber()
  teamSize?: number;

  @ApiPropertyOptional({ description: 'Team role' })
  @IsOptional()
  @IsString()
  teamRole?: string;

  @ApiPropertyOptional({ description: 'Client testimonial' })
  @IsOptional()
  @IsString()
  clientTestimonial?: string;

  @ApiPropertyOptional({ description: 'Client name' })
  @IsOptional()
  @IsString()
  clientName?: string;

  @ApiPropertyOptional({ description: 'Client position' })
  @IsOptional()
  @IsString()
  clientPosition?: string;

  @ApiPropertyOptional({ description: 'Load time' })
  @IsOptional()
  @IsNumber()
  loadTime?: number;

  @ApiPropertyOptional({ description: 'Performance score' })
  @IsOptional()
  @IsNumber()
  performanceScore?: number;

  @ApiPropertyOptional({ description: 'Accessibility score' })
  @IsOptional()
  @IsNumber()
  accessibilityScore?: number;

  @IsOptional()
  timeline?: {
    start?: string;
    end?: string;
    duration?: string;
  };

  @IsOptional()
  team?: {
    size?: number;
    role?: string;
  };

  @ApiPropertyOptional({
    description: 'Project results and metrics',
    type: 'array',
    example: [
      { metric: 'Active Users', value: '2,500+' },
      { metric: 'Performance Improvement', value: '40%' },
    ],
  })
  @IsOptional()
  results?: Array<{
    metric: string;
    value: string;
  }>;

  @ApiPropertyOptional({ description: 'Project type' })
  @IsOptional()
  @IsString()
  projectType?: string;
}
