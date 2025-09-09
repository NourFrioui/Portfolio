import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @ApiProperty({
    description: 'Category name',
    example: 'Frontend',
  })
  @Prop({ required: true, unique: true })
  name: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Frontend development technologies',
  })
  @Prop()
  description?: string;

  @ApiProperty({
    description: 'Category color for UI display',
    example: '#3B82F6',
  })
  @Prop()
  color?: string;

  @ApiProperty({
    description: 'Category icon class or URL',
    example: 'fas fa-code',
  })
  @Prop()
  icon?: string;

  @ApiProperty({
    description: 'Display order',
    example: 1,
  })
  @Prop({ default: 0 })
  order: number;

  @ApiProperty({
    description: 'Whether the category is active',
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

export const CategorySchema = SchemaFactory.createForClass(Category);
