import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ExperienceDocument = Experience & Document;

@Schema({ timestamps: true })
export class Experience {
  @ApiProperty({
    description: 'Company name (localized)',
    example: { en: 'Tech Corp', fr: 'Tech Corp' },
  })
  @Prop({
    type: {
      en: { type: String, required: true },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: true,
  })
  company: { en: string; fr?: string };

  @ApiProperty({
    description: 'Experience name/title (localized)',
    example: {
      en: 'Senior Developer at Tech Corp',
      fr: 'Développeur Senior chez Tech Corp',
    },
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
    description: 'Job title (localized)',
    example: { en: 'Senior Developer', fr: 'Développeur Senior' },
  })
  @Prop({
    type: {
      en: { type: String, required: true },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: true,
  })
  position: { en: string; fr?: string };

  @ApiProperty({
    description: 'Job description (localized)',
    example: {
      en: 'Developed web applications...',
      fr: 'Développé des applications web...',
    },
  })
  @Prop({
    type: {
      en: { type: String, required: true },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: true,
  })
  description: { en: string; fr?: string };

  @ApiProperty({
    description: 'Location (localized)',
    example: { en: 'Paris, France', fr: 'Paris, France' },
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
  location?: { en?: string; fr?: string };

  @ApiProperty({
    description: 'Start date',
    example: '2020-01',
  })
  @Prop({ required: true })
  startDate: string;

  @ApiProperty({
    description: 'End date',
    example: '2023-12',
    required: false,
  })
  @Prop()
  endDate?: string;

  @ApiProperty({
    description: 'Whether currently working here',
    example: false,
  })
  @Prop({ default: false })
  isCurrent: boolean;

  @ApiProperty({
    description: 'Technologies used',
    example: ['React', 'Node.js', 'MongoDB'],
    required: false,
  })
  @Prop([String])
  technologies?: string[];

  @ApiProperty({
    description: 'Key achievements (localized)',
    example: [
      {
        en: 'Led team of 5 developers',
        fr: 'Dirigé une équipe de 5 développeurs',
      },
    ],
    required: false,
  })
  @Prop({ type: [{ en: String, fr: String }], _id: false, default: [] })
  achievements?: Array<{ en?: string; fr?: string }>;

  @ApiProperty({
    description: 'Company website',
    example: 'https://techcorp.com',
    required: false,
  })
  @Prop()
  companyWebsite?: string;

  @ApiProperty({
    description: 'Display order',
    example: 1,
  })
  @Prop({ default: 0 })
  order: number;

  @ApiProperty({
    description: 'Whether the experience is active/visible',
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

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
ExperienceSchema.index({ 'company.en': 1 });
ExperienceSchema.index({ 'position.en': 1 });
ExperienceSchema.index({ startDate: -1 });
ExperienceSchema.index({ createdAt: -1 });
