import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  IsUrl,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { LocalizedStringDto } from '../../common/dto/localized-string.dto';
import { toLocalized } from '../../common/transformers/to-localized.transformer';

export class CreateStudyDto {
  @ApiProperty({ type: LocalizedStringDto })
  @IsNotEmpty()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  institution: LocalizedStringDto;

  @ApiProperty({ type: LocalizedStringDto })
  @IsNotEmpty()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  degree: LocalizedStringDto;

  @ApiProperty({ type: LocalizedStringDto })
  @IsNotEmpty()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  field: LocalizedStringDto;

  @ApiPropertyOptional({ type: LocalizedStringDto })
  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  description?: LocalizedStringDto;

  @ApiPropertyOptional({ type: LocalizedStringDto })
  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  location?: LocalizedStringDto;

  @ApiProperty({
    description: 'Start date (YYYY-MM format)',
    example: '2018-09',
  })
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @ApiPropertyOptional({
    description: 'End date (YYYY-MM format)',
    example: '2020-06',
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Whether currently studying',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @ApiPropertyOptional({ description: 'Grade/GPA', example: '3.8/4.0' })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiPropertyOptional({ type: [LocalizedStringDto] })
  @IsOptional()
  @IsArray()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested({ each: true })
  subjects?: LocalizedStringDto[];

  @ApiPropertyOptional({ type: [LocalizedStringDto] })
  @IsOptional()
  @IsArray()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested({ each: true })
  achievements?: LocalizedStringDto[];

  @ApiPropertyOptional({ type: [LocalizedStringDto] })
  @IsOptional()
  @IsArray()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested({ each: true })
  coursework?: LocalizedStringDto[];

  @ApiPropertyOptional({ type: [LocalizedStringDto] })
  @IsOptional()
  @IsArray()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested({ each: true })
  honors?: LocalizedStringDto[];

  @ApiPropertyOptional({
    description: 'Institution website',
    example: 'https://university.edu',
  })
  @IsOptional()
  @IsUrl({ require_protocol: false })
  institutionWebsite?: string;

  @ApiPropertyOptional({ description: 'Display order', example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({
    description: 'Whether the study is active/visible',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
