import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TagDocument = Tag & Document;

@Schema({ timestamps: true })
export class Tag {
  @ApiProperty({ description: 'Tag name', example: 'nextjs' })
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @ApiProperty({ description: 'Hex color for the tag', example: '#3b82f6', required: false })
  @Prop({ default: '#3b82f6' })
  color?: string;

  @ApiProperty({ description: 'Active flag', example: true })
  @Prop({ default: true })
  isActive?: boolean;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
TagSchema.index({ name: 1 }, { unique: true });
