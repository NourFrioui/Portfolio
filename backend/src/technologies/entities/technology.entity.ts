import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TechnologyDocument = Technology & Document;

@Schema()
export class Technology {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  percentage: number;

  @Prop()
  iconUrl?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TechnologySchema = SchemaFactory.createForClass(Technology);
TechnologySchema.index({ name: 1 });
TechnologySchema.index({ createdAt: -1 });
