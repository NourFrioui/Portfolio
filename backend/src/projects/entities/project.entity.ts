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

  @ApiProperty({ description: 'Long description', required: false })
  @Prop()
  longDescription?: string;

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

  @ApiProperty({ description: 'Live URL', required: false })
  @Prop()
  liveUrl?: string;

  @ApiProperty({
    description: 'Timeline information',
    type: 'object',
    properties: {
      start: { type: 'string', example: '2023-01' },
      end: { type: 'string', example: '2023-06' },
      duration: { type: 'string', example: '6 months' },
    },
    additionalProperties: false,
  })
  @Prop({ type: { start: String, end: String, duration: String }, _id: false })
  timeline?: {
    start?: string;
    end?: string;
    duration?: string;
  };

  @ApiProperty({
    description: 'Team information',
    type: 'object',
    properties: {
      size: { type: 'number', example: 4 },
      role: { type: 'string', example: 'Frontend Developer' },
    },
    additionalProperties: false,
  })
  @Prop({ type: { size: Number, role: String }, _id: false })
  team?: {
    size?: number;
    role?: string;
  };

  @ApiProperty({
    description: 'Project results and metrics',
    type: 'array',
    required: false,
    example: [
      { metric: 'Active Users', value: '2,500+' },
      { metric: 'Performance Improvement', value: '40%' },
    ],
  })
  @Prop({ type: [{ metric: String, value: String }], _id: false, default: [] })
  results?: Array<{
    metric: string;
    value: string;
  }>;

  @ApiProperty({
    description: 'Client testimonial',
    type: 'object',
    properties: {
      text: { type: 'string', example: 'Great work!' },
      author: { type: 'string', example: 'John Doe' },
      position: { type: 'string', example: 'CEO at Company' },
    },
    additionalProperties: false,
  })
  @Prop({
    type: {
      text: { type: String },
      author: { type: String },
      position: { type: String },
    },
    _id: false,
  })
  clientTestimonial?: {
    text: string;
    author: string;
    position?: string;
  };

  @ApiProperty({
    description: 'Start date',
    required: false,
  })
  @Prop()
  startDate?: string;

  @ApiProperty({
    description: 'End date',
    required: false,
  })
  @Prop()
  endDate?: string;
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
    description: 'Load time',
    required: false,
  })
  @Prop()
  loadTime?: number;

  @ApiProperty({
    description: 'Performance score',
    required: false,
  })
  @Prop()
  performanceScore?: number;

  @ApiProperty({
    description: 'Accessibility score',
    required: false,
  })
  @Prop()
  accessibilityScore?: number;

  @ApiProperty({
    description: 'Project type',
    required: false,
  })
  @Prop()
  projectType?: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ title: 'text', description: 'text', category: 1 });
