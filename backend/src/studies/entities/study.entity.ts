import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type StudyDocument = Study & Document;

@Schema({ timestamps: true })
export class Study {
  @ApiProperty({
    description: 'Institution name (localized)',
    example: {
      en: 'University of Technology',
      fr: 'Université de Technologie',
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
  institution: { en: string; fr?: string };

  @ApiProperty({
    description: 'Degree/Program name (localized)',
    example: { en: 'Master in Computer Science', fr: 'Master en Informatique' },
  })
  @Prop({
    type: {
      en: { type: String, required: true },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: true,
  })
  degree: { en: string; fr?: string };

  @ApiProperty({
    description: 'Field of study (localized)',
    example: { en: 'Computer Science', fr: 'Informatique' },
  })
  @Prop({
    type: {
      en: { type: String, required: true },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: true,
  })
  field: { en: string; fr?: string };

  @ApiProperty({
    description: 'Study description (localized)',
    example: {
      en: 'Focused on software engineering...',
      fr: "Axé sur l'ingénierie logicielle...",
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
    example: '2018-09',
  })
  @Prop({ required: true })
  startDate: string;

  @ApiProperty({
    description: 'End date',
    example: '2020-06',
    required: false,
  })
  @Prop()
  endDate?: string;

  @ApiProperty({
    description: 'Whether currently studying',
    example: false,
  })
  @Prop({ default: false })
  isCurrent: boolean;

  @ApiProperty({
    description: 'Grade/GPA',
    example: '3.8/4.0',
    required: false,
  })
  @Prop()
  grade?: string;

  @ApiProperty({
    description: 'Key subjects/courses (localized)',
    example: [{ en: 'Data Structures', fr: 'Structures de Données' }],
    required: false,
  })
  @Prop({ type: [{ en: String, fr: String }], _id: false, default: [] })
  subjects?: Array<{ en?: string; fr?: string }>;

  @ApiProperty({
    description: 'Achievements (localized)',
    example: [{ en: 'Graduated with honors', fr: 'Diplômé avec mention' }],
    required: false,
  })
  @Prop({ type: [{ en: String, fr: String }], _id: false, default: [] })
  achievements?: Array<{ en?: string; fr?: string }>;

  @ApiProperty({
    description: 'Coursework (localized)',
    example: [{ en: 'Advanced Algorithms', fr: 'Algorithmes Avancés' }],
    required: false,
  })
  @Prop({ type: [{ en: String, fr: String }], _id: false, default: [] })
  coursework?: Array<{ en?: string; fr?: string }>;

  @ApiProperty({
    description: 'Honors and awards (localized)',
    example: [{ en: 'Summa Cum Laude', fr: 'Summa Cum Laude' }],
    required: false,
  })
  @Prop({ type: [{ en: String, fr: String }], _id: false, default: [] })
  honors?: Array<{ en?: string; fr?: string }>;

  @ApiProperty({
    description: 'Institution website',
    example: 'https://university.edu',
    required: false,
  })
  @Prop()
  institutionWebsite?: string;

  @ApiProperty({
    description: 'Display order',
    example: 1,
  })
  @Prop({ default: 0 })
  order: number;

  @ApiProperty({
    description: 'Whether the study is active/visible',
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

export const StudySchema = SchemaFactory.createForClass(Study);
StudySchema.index({ 'institution.en': 1 });
StudySchema.index({ 'degree.en': 1 });
StudySchema.index({ 'field.en': 1 });
StudySchema.index({ startDate: -1 });
StudySchema.index({ createdAt: -1 });
