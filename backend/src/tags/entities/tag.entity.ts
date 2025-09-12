import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TagDocument = Tag & Document;

@Schema({ timestamps: true })
export class Tag {
  @ApiProperty({
    description: 'Tag name (localized)',
    example: { en: 'React', fr: 'React' },
  })
  @Prop({
    type: {
      en: { type: String, required: true },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: true,
  })
  name: { en: string; fr?: string };

  @ApiProperty({
    description: 'Tag description (localized)',
    example: {
      en: 'JavaScript library for building user interfaces',
      fr: 'Bibliothèque JavaScript pour créer des interfaces utilisateur',
    },
    required: false,
  })
  @Prop({
    type: {
      en: { type: String, required: false },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: false,
  })
  description?: { en?: string; fr?: string };

  @ApiProperty({
    description: 'Tag category',
    example: 'technology',
    enum: ['technology', 'skill', 'tool', 'framework', 'language', 'other'],
  })
  @Prop({
    type: String,
    enum: ['technology', 'skill', 'tool', 'framework', 'language', 'other'],
    default: 'other',
  })
  category: string;

  @ApiProperty({
    description: 'Tag color for UI display',
    example: '#61DAFB',
    required: false,
  })
  @Prop()
  color?: string;

  @ApiProperty({
    description: 'Tag icon URL',
    example: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg',
    required: false,
  })
  @Prop()
  iconUrl?: string;

  @ApiProperty({
    description: 'Whether the tag is active/visible',
    example: true,
  })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Display order',
    example: 1,
  })
  @Prop({ default: 0 })
  order: number;

  @ApiProperty({
    description: 'Usage count across all entities',
    example: 15,
  })
  @Prop({ default: 0 })
  usageCount: number;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
TagSchema.index({ 'name.en': 1 });
TagSchema.index({ category: 1 });
TagSchema.index({ isActive: 1 });
TagSchema.index({ usageCount: -1 });
TagSchema.index({ createdAt: -1 });
