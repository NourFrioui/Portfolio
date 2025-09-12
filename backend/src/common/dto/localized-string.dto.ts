import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class LocalizedStringDto {
  @ApiPropertyOptional({ description: 'English content' })
  @IsOptional()
  @IsString()
  en?: string;

  @ApiPropertyOptional({ description: 'French content' })
  @IsOptional()
  @IsString()
  fr?: string;
}
