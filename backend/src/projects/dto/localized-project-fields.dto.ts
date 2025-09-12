import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { LocalizedStringDto } from '../../common/dto/localized-string.dto';
import { toLocalized } from '../../common/transformers/to-localized.transformer';

export class LocalizedProjectFieldsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(toLocalized)
  title?: LocalizedStringDto;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(toLocalized)
  description?: LocalizedStringDto;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(toLocalized)
  longDescription?: LocalizedStringDto;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(toLocalized)
  detailedDescription?: LocalizedStringDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  team?: { size?: number; role?: LocalizedStringDto };

  @ApiPropertyOptional({ type: Array })
  @IsOptional()
  results?: Array<{ metric: LocalizedStringDto; value: string }>;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  clientTestimonial?: {
    text?: LocalizedStringDto;
    author?: LocalizedStringDto;
    position?: LocalizedStringDto;
  };
}
