import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StudyDocument = Study & Document;

@Schema({ timestamps: true })
export class Study {
  @Prop({ required: true })
  degree: string;

  @Prop({ required: true })
  institution: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ type: Date })
  endDate?: Date;

  @Prop({ default: false })
  current: boolean;

  @Prop({ required: true })
  description: string;

  @Prop()
  gpa?: string;

  @Prop([String])
  honors?: string[];

  @Prop([String])
  coursework?: string[];

  @Prop()
  logo?: string;
}

export const StudySchema = SchemaFactory.createForClass(Study);
