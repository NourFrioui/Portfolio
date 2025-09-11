import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The name of the contact' })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'The email of the contact' })
  email: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'The subject of the contact message' })
  subject?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @ApiProperty({ description: 'The message of the contact' })
  message: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Project type' })
  projectType?: string;
}
