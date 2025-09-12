import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  IsBoolean,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { LocalizedStringDto } from '../../common/dto/localized-string.dto';
import { toLocalized } from '../../common/transformers/to-localized.transformer';

export class CreateTechnologyDto {
  @ApiProperty({ type: LocalizedStringDto })
  @IsNotEmpty()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  name: LocalizedStringDto;

  @ApiProperty({ minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  percentage: number;

  @ApiPropertyOptional({
    description: 'Technology icon URL or class',
    example: 'https://example.com/react-icon.svg',
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({
    description: 'Technology description (localized)',
    type: LocalizedStringDto,
  })
  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  description?: LocalizedStringDto;

  @ApiPropertyOptional({
    description: 'Category ID',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Display order',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiPropertyOptional({
    description: 'Whether the technology is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
