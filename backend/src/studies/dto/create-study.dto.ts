import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDateString,
} from 'class-validator';

export class CreateStudyDto {
  @IsString()
  degree: string;

  @IsString()
  institution: string;

  @IsString()
  location: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsBoolean()
  current: boolean;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  gpa?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  honors?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  coursework?: string[];

  @IsOptional()
  @IsString()
  logo?: string;
}
