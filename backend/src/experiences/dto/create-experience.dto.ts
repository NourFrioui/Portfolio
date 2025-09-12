import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  IsUrl,
  IsNumber,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { LocalizedStringDto } from '../../common/dto/localized-string.dto';
import { toLocalized } from '../../common/transformers/to-localized.transformer';

export class CreateExperienceDto {
  @ApiProperty({ type: LocalizedStringDto })
  @IsNotEmpty()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  company: LocalizedStringDto;

  @ApiProperty({ type: LocalizedStringDto })
  @IsNotEmpty()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  name: LocalizedStringDto;

  @ApiProperty({ type: LocalizedStringDto })
  @IsNotEmpty()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  position: LocalizedStringDto;

  @ApiProperty({ type: LocalizedStringDto })
  @IsNotEmpty()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  description: LocalizedStringDto;

  @ApiPropertyOptional({ type: LocalizedStringDto })
  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  location?: LocalizedStringDto;

  @ApiProperty({
    description: 'Start date (YYYY-MM format)',
    example: '2020-01',
  })
  @IsNotEmpty()
  @IsString()
  startDate: string;

  @ApiPropertyOptional({
    description: 'End date (YYYY-MM format)',
    example: '2023-12',
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Whether currently working here',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @ApiPropertyOptional({
    description: 'Technologies used',
    example: ['React', 'Node.js'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies?: string[];

  @ApiPropertyOptional({ type: [LocalizedStringDto] })
  @IsOptional()
  @IsArray()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested({ each: true })
  achievements?: LocalizedStringDto[];

  @ApiPropertyOptional({
    description: 'Company website',
    example: 'https://techcorp.com',
  })
  @IsOptional()
  @IsUrl({ require_protocol: false })
  companyWebsite?: string;

  @ApiPropertyOptional({ description: 'Display order', example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;

  @ApiPropertyOptional({
    description: 'Whether the experience is active/visible',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
