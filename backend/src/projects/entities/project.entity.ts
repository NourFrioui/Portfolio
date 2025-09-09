import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @ApiProperty({
    description: 'Project title',
    example: 'E-commerce Platform',
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    description: 'Project description',
    example: 'A full-stack e-commerce platform built with React and Node.js',
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    description: 'Detailed project description',
    example:
      'This project includes user authentication, payment processing, inventory management...',
    required: false,
  })
  @Prop()
  detailedDescription?: string;

  @ApiProperty({
    description: 'Category ID',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  @Prop({ type: Types.ObjectId, ref: 'Category' })
  categoryId?: Types.ObjectId;

  @ApiProperty({
    description: 'Main project image URL',
    example: 'https://example.com/project-image.jpg',
    required: false,
  })
  @Prop()
  imageUrl?: string;

  @ApiProperty({
    description: 'Additional project images',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    required: false,
  })
  @Prop([String])
  images?: string[];

  @ApiProperty({
    description: 'Technologies used in the project',
    example: ['React', 'Node.js', 'MongoDB', 'Express'],
    required: false,
  })
  @Prop([String])
  technologies?: string[];

  @ApiProperty({
    description: 'Tags for the project',
    example: ['ecommerce', 'fullstack', 'nextjs'],
    required: false,
  })
  @Prop([String])
  tags?: string[];

  @ApiProperty({
    description: 'Project features',
    example: ['User Authentication', 'Payment Integration', 'Real-time Chat'],
    required: false,
  })
  @Prop([String])
  features?: string[];

  @ApiProperty({
    description: 'Project challenges faced',
    example: ['Scalability issues', 'Performance optimization'],
    required: false,
  })
  @Prop([String])
  challenges?: string[];

  @ApiProperty({
    description: 'Solutions implemented',
    example: ['Implemented caching', 'Optimized database queries'],
    required: false,
  })
  @Prop([String])
  solutions?: string[];

  @ApiProperty({
    description: 'Project URL',
    example: 'https://myproject.com',
    required: false,
  })
  @Prop()
  projectUrl?: string;

  @ApiProperty({
    description: 'GitHub repository URL',
    example: 'https://github.com/user/project',
    required: false,
  })
  @Prop()
  githubUrl?: string;

  @ApiProperty({
    description: 'Project status',
    example: 'completed',
    enum: ['planning', 'in-progress', 'completed', 'on-hold'],
  })
  @Prop({
    enum: ['planning', 'in-progress', 'completed', 'on-hold'],
    default: 'completed',
  })
  status: string;

  @ApiProperty({
    description: 'Display order',
    example: 1,
  })
  @Prop({ default: 0 })
  order: number;

  @ApiProperty({
    description: 'Whether the project is featured',
    example: true,
  })
  @Prop({ default: false })
  isFeatured: boolean;

  @ApiProperty({
    description: 'Whether the project is active/visible',
    example: true,
  })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Creation date',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
  })
  updatedAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ title: 'text', description: 'text', category: 1 });
