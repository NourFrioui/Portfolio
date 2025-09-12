import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { LocalizedStringDto } from '../../common/dto/localized-string.dto';
import { toLocalized } from '../../common/transformers/to-localized.transformer';

export class CreateTagDto {
  @IsNotEmpty()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  @ApiProperty({ description: 'Tag name (localized)', type: LocalizedStringDto })
  name: LocalizedStringDto;

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  @ApiPropertyOptional({ description: 'Tag description (localized)', type: LocalizedStringDto })
  description?: LocalizedStringDto;

  @IsOptional()
  @IsEnum(['technology', 'skill', 'tool', 'framework', 'language', 'other'])
  @ApiPropertyOptional({
    description: 'Tag category',
    enum: ['technology', 'skill', 'tool', 'framework', 'language', 'other'],
    default: 'other',
  })
  category?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Tag color for UI display', example: '#61DAFB' })
  color?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({ description: 'Tag icon URL', example: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg' })
  iconUrl?: string;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Whether the tag is active/visible', default: true })
  isActive?: boolean;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Display order', default: 0 })
  order?: number;
}