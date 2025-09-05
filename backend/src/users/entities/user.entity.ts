import { HydratedDocument, Schema } from 'mongoose';
import { Prop, Schema as NestSchema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from 'src/common/enums/user-role.enum';

export type UserDocument = HydratedDocument<User>;

@NestSchema({ timestamps: true })
export class User {
  @Prop({ type: Schema.Types.ObjectId, auto: true })
  _id: Schema.Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  role: UserRole;

  @Prop()
  avatar: string;

  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop()
  zipCode: string;

  @Prop()
  state: string;

  @Prop()
  company: string;

  @Prop()
  jobTitle: string;

  @Prop()
  bio: string;

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

  @Prop()
  skills: string[];

  @Prop()
  experiences: string[];

  @Prop()
  education: string[];

  @Prop()
  certifications: string[];

  @Prop()
  details: string;

  @Prop()
  proImage: string;

  @Prop()
  CV: string;

  // Portfolio specific fields
  @Prop()
  fullName: string;

  @Prop()
  title: string;

  @Prop()
  location: string;

  @Prop()
  profileImage: string;

  @Prop()
  resumeUrl: string;

  @Prop({ default: 0 })
  yearsOfExperience: number;

  @Prop({ default: true })
  availableForWork: boolean;

  @Prop()
  hourlyRate: string;

  @Prop({ type: [String], default: [] })
  languages: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
