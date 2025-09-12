import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsUrl,
  IsEmail,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { LocalizedStringDto } from '../../common/dto/localized-string.dto';
import { toLocalized } from '../../common/transformers/to-localized.transformer';

export class UpdateProfileDto {
  @IsOptional()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @Transform(toLocalized)
  fullName?: string | LocalizedStringDto;

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  title?: LocalizedStringDto;

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  bio?: LocalizedStringDto;

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  description?: LocalizedStringDto;

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  location?: LocalizedStringDto;

  @IsOptional()
  phone?: string;

  @IsOptional()
  website?: string;

  @IsOptional()
  linkedin?: string;

  @IsOptional()
  github?: string;

  @IsOptional()
  @IsUrl()
  twitter?: string;

  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  @IsOptional()
  @IsString()
  resumeUrl?: string;

  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;

  @IsOptional()
  @IsBoolean()
  availableForWork?: boolean;

  @IsOptional()
  @IsString()
  hourlyRate?: string;

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested({ each: true })
  skills?: LocalizedStringDto[];

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested({ each: true })
  languages?: LocalizedStringDto[];
}
