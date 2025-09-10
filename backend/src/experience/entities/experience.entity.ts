import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ExperienceDocument = Experience & Document;

@Schema({ timestamps: true })
export class Experience {
  @ApiProperty({
    description: 'Company name',
    example: 'Google',
  })
  @Prop({ required: true })
  company: string;

  @ApiProperty({
    description: 'Job position',
    example: 'Senior Full Stack Developer',
  })
  @Prop({ required: true })
  position: string;

  @ApiProperty({
    description: 'Start date',
    example: '2023-01-15',
  })
  @Prop({ required: true })
  startDate: Date;

  @ApiProperty({
    description: 'End date',
    example: '2024-01-15',
    required: false,
  })
  @Prop()
  endDate?: Date;

  @ApiProperty({
    description: 'Job description',
    example:
      'Developed and maintained web applications using React and Node.js',
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    description: 'Technologies used',
    example: ['React', 'Node.js', 'MongoDB'],
    required: false,
  })
  @Prop([String])
  technologies?: string[];

  @ApiProperty({
    description: 'Company logo URL',
    example: 'https://example.com/logo.png',
    required: false,
  })
  @Prop()
  companyLogo?: string;

  @ApiProperty({
    description: 'Key highlights as bullet points',
    example: ['Led a team of 5 engineers', 'Reduced page load time by 40%'],
    required: false,
  })
  @Prop([String])
  highlights?: string[];

  @ApiProperty({
    description: 'Related project IDs',
    example: ['68b8716f55803e5ef8ad898a', '68c04b8e4cb0d1be7f09cad3'],
    required: false,
  })
  @Prop({ type: [Types.ObjectId], ref: 'Project', default: [] })
  projectIds?: Types.ObjectId[];

  @ApiProperty({
    description: 'Tags related to this experience',
    example: ['leadership', 'remote', 'fulltime'],
    required: false,
  })
  @Prop([String])
  tags?: string[];

  @ApiProperty({
    description: 'Work location',
    example: 'San Francisco, CA',
    required: false,
  })
  @Prop()
  location?: string;

  @ApiProperty({
    description: 'Whether this is the current job',
    example: false,
  })
  @Prop({ default: false })
  isCurrentJob?: boolean;

  @ApiProperty({
    description: 'Category ID',
    example: '507f1f77bcf86cd799439011',
    required: false,
  })
  @Prop({ type: Types.ObjectId, ref: 'Category' })
  categoryId?: Types.ObjectId;

  @ApiProperty({
    description: 'Display order',
    example: 1,
  })
  @Prop({ default: 0 })
  order: number;

  @ApiProperty({
    description: 'Creation date',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
  })
  updatedAt: Date;
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
