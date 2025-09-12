import { HydratedDocument, Schema } from 'mongoose';
import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../../common/enums/user-role.enum';

export type UserDocument = HydratedDocument<User>;

@NestSchema({ timestamps: true })
export class User {
  @Prop({ type: Schema.Types.ObjectId, auto: true })
  _id: Schema.Types.ObjectId;

  @Prop({
    type: {
      en: { type: String, required: false },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: false,
  })
  lastName?: { en?: string; fr?: string };

  @Prop({
    type: {
      en: { type: String, required: false },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: false,
  })
  firstName?: { en?: string; fr?: string };

  @Prop({ required: false })
  phone: string;

  @Prop({
    type: {
      en: { type: String, required: false },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: false,
  })
  address?: { en?: string; fr?: string };

  @Prop({ required: false, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  role: UserRole;

  @Prop()
  avatar: string;

  @Prop({
    type: {
      en: { type: String, required: false },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: false,
  })
  city?: { en?: string; fr?: string };

  @Prop({
    type: {
      en: { type: String, required: false },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: false,
  })
  country?: { en?: string; fr?: string };

  @Prop()
  zipCode: string;

  @Prop({
    type: {
      en: { type: String, required: false },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: false,
  })
  state?: { en?: string; fr?: string };

  @Prop({
    type: {
      en: { type: String, required: false },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: false,
  })
  company?: { en?: string; fr?: string };

  @Prop({
    type: {
      en: { type: String, required: false },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: false,
  })
  jobTitle?: { en?: string; fr?: string };

  @Prop({
    type: {
      en: { type: String, required: false },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: false,
  })
  bio?: { en?: string; fr?: string };

  @Prop({
    type: {
      en: { type: String, required: false },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: false,
  })
  description?: { en?: string; fr?: string };

  @Prop()
  linkedin: string;

  @Prop()
  twitter: string;

  @Prop()
  instagram: string;

  @Prop()
  facebook: string;

  @Prop()
  youtube: string;

  @Prop()
  github: string;

  @Prop()
  website: string;

  @Prop({ type: [{ en: String, fr: String }], _id: false, default: [] })
  skills?: Array<{ en?: string; fr?: string }>;

  @Prop({ type: [{ en: String, fr: String }], _id: false, default: [] })
  experiences?: Array<{ en?: string; fr?: string }>;

  @Prop({ type: [{ en: String, fr: String }], _id: false, default: [] })
  education?: Array<{ en?: string; fr?: string }>;

  @Prop({ type: [{ en: String, fr: String }], _id: false, default: [] })
  certifications?: Array<{ en?: string; fr?: string }>;

  @Prop({
    type: {
      en: { type: String, required: false },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: false,
  })
  details?: { en?: string; fr?: string };

  @Prop()
  proImage: string;

  @Prop()
  CV: string;

  // Portfolio specific fields
  @Prop({
    type: {
      en: { type: String, required: false },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: false,
  })
  fullName?: { en?: string; fr?: string };

  @Prop({
    type: {
      en: { type: String, required: false },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: false,
  })
  title?: { en?: string; fr?: string };

  @Prop({
    type: {
      en: { type: String, required: false },
      fr: { type: String, default: '' },
    },
    _id: false,
    required: false,
  })
  location?: { en?: string; fr?: string };

  @Prop()
  profileImageUrl?: string;

  @Prop()
  resumeUrl?: string;

  @Prop()
  linkedinUrl?: string;

  @Prop({ default: 0 })
  yearsOfExperience: number;

  @Prop({ default: true })
  availableForWork: boolean;

  @Prop()
  hourlyRate: string;

  @Prop({ type: [{ en: String, fr: String }], _id: false, default: [] })
  languages?: Array<{ en?: string; fr?: string }>;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ 'firstName.en': 1 });
UserSchema.index({ 'lastName.en': 1 });
UserSchema.index({ 'title.en': 1 });
UserSchema.index({ 'bio.en': 1 });
UserSchema.index({ 'description.en': 1 });
UserSchema.index({ createdAt: -1 });
