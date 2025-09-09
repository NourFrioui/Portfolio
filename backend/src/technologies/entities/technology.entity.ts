import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TechnologyDocument = Technology & Document;

@Schema({ timestamps: true })
export class Technology {
  @ApiProperty({
    description: 'Technology name',
    example: 'React',
  })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({
    description: 'Proficiency percentage',
    example: 85,
  })
  @Prop({ required: true, min: 0, max: 100 })
  percentage: number;

  @ApiProperty({
    description: 'Technology icon URL or class',
    example: 'https://example.com/react-icon.svg',
    required: false,
  })
  @Prop()
  icon?: string;

  @ApiProperty({
    description: 'Technology description',
    example: 'A JavaScript library for building user interfaces',
    required: false,
  })
  @Prop()
  description?: string;

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
    description: 'Whether the technology is active',
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

export const TechnologySchema = SchemaFactory.createForClass(Technology);
TechnologySchema.index({ name: 1 });
TechnologySchema.index({ createdAt: -1 });
