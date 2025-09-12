import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { LocalizedStringDto } from '../../common/dto/localized-string.dto';
import { toLocalized } from '../../common/transformers/to-localized.transformer';

export class CreateContactDto {
  @IsNotEmpty()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  @ApiProperty({
    description: 'The name of the contact (localized)',
    type: LocalizedStringDto,
  })
  name: LocalizedStringDto;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'The email of the contact' })
  email: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'The subject of the contact message' })
  subject?: string;

  @IsNotEmpty()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  @ApiProperty({
    description: 'The message of the contact (localized)',
    type: LocalizedStringDto,
  })
  message: LocalizedStringDto;

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  @ApiPropertyOptional({
    description: 'Project type (localized)',
    type: LocalizedStringDto,
  })
  projectType?: LocalizedStringDto;
}
