import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema()
export class Contact {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: false })
  projectType?: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ email: 1 });
