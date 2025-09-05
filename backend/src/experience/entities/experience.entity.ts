import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExperienceDocument = Experience & Document;

@Schema({ timestamps: true })
export class Experience {
  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  position: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate?: Date;

  @Prop({ required: true })
  description: string;

  @Prop([String])
  technologies?: string[];

  @Prop()
  location?: string;

  @Prop({ default: false })
  isCurrentJob?: boolean;
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
