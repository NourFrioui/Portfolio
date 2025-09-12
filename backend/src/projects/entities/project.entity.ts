import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @ApiProperty({ description: 'Project title (localized)' })
  @Prop({
    type: {
      en: { type: String, required: true },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: true,
  })
  title: { en: string; fr?: string };

  @ApiProperty({ description: 'Project description (localized)' })
  @Prop({
    type: {
      en: { type: String, required: true },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: true,
  })
  description: { en: string; fr?: string };

  @ApiProperty({ description: 'Long description (localized)', required: false })
  @Prop({ type: { en: String, fr: String }, _id: false })
  longDescription?: { en?: string; fr?: string };

  @ApiProperty({
    description: 'Detailed project description (localized)',
    required: false,
  })
  @Prop({ type: { en: String, fr: String }, _id: false })
  detailedDescription?: { en?: string; fr?: string };

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
    description: 'Technology IDs used in the project',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    required: false,
  })
  @Prop([{ type: Types.ObjectId, ref: 'Technology' }])
  technologyIds?: Types.ObjectId[];

  @ApiProperty({
    description: 'Tag IDs for the project',
    example: ['507f1f77bcf86cd799439013', '507f1f77bcf86cd799439014'],
    required: false,
  })
  @Prop([{ type: Types.ObjectId, ref: 'Tag' }])
  tagIds?: Types.ObjectId[];

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
  @Prop({
    type: { size: Number, role: { en: String, fr: String } },
    _id: false,
  })
  team?: {
    size?: number;
    role?: { en?: string; fr?: string };
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
  @Prop({
    type: [{ metric: { en: String, fr: String }, value: String }],
    _id: false,
    default: [],
  })
  results?: Array<{
    metric: { en?: string; fr?: string };
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
      text: { en: String, fr: String },
      author: { en: String, fr: String },
      position: { en: String, fr: String },
    },
    _id: false,
  })
  clientTestimonial?: {
    text?: { en?: string; fr?: string };
    author?: { en?: string; fr?: string };
    position?: { en?: string; fr?: string };
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
ProjectSchema.index({
  'title.en': 'text',
  'description.en': 'text',
  category: 1,
});
