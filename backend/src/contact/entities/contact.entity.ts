import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema()
export class Contact {
  @Prop({
    type: {
      en: { type: String, required: true },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: true,
  })
  name: { en: string; fr?: string };

  @Prop({ required: true })
  email: string;

  @Prop({
    type: {
      en: { type: String, required: true },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: true,
  })
  message: { en: string; fr?: string };

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: { en: String, fr: String }, _id: false, required: false })
  projectType?: { en?: string; fr?: string };
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ email: 1 });
ContactSchema.index({ 'name.en': 1 });
