import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { UserRole } from 'src/common/enums/user-role.enum';
import { LocalizedStringDto } from '../../common/dto/localized-string.dto';
import { toLocalized } from '../../common/transformers/to-localized.transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'The username of the user' })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ description: 'The password of the user' })
  password: string;

  @IsOptional()
  @ApiProperty({ description: 'The role of the user', default: UserRole.ADMIN })
  role?: UserRole;

  @IsOptional()
  @ApiProperty({ description: 'The avatar of the user' })
  avatar?: string;

  @IsOptional()
  @ApiProperty({ description: 'The phone of the user' })
  phone?: string;

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  @ApiPropertyOptional({
    description: 'The address of the user (localized)',
    type: LocalizedStringDto,
  })
  address?: LocalizedStringDto;

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  @ApiPropertyOptional({
    description: 'The city of the user (localized)',
    type: LocalizedStringDto,
  })
  city?: LocalizedStringDto;

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  @ApiPropertyOptional({
    description: 'The country of the user (localized)',
    type: LocalizedStringDto,
  })
  country?: LocalizedStringDto;

  @IsOptional()
  @ApiProperty({ description: 'The zip code of the user' })
  zipCode?: string;

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  @ApiPropertyOptional({
    description: 'The state of the user (localized)',
    type: LocalizedStringDto,
  })
  state?: LocalizedStringDto;

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  @ApiPropertyOptional({
    description: 'The company of the user (localized)',
    type: LocalizedStringDto,
  })
  company?: LocalizedStringDto;

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  @ApiPropertyOptional({
    description: 'The job title of the user (localized)',
    type: LocalizedStringDto,
  })
  jobTitle?: LocalizedStringDto;

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  @ApiPropertyOptional({
    description: 'The bio of the user (localized)',
    type: LocalizedStringDto,
  })
  bio?: LocalizedStringDto;

  @IsOptional()
  @ApiProperty({ description: 'The linkedin of the user' })
  linkedin?: string;

  @IsOptional()
  @ApiProperty({ description: 'The twitter of the user' })
  twitter?: string;

  @IsOptional()
  @ApiProperty({ description: 'The instagram of the user' })
  instagram?: string;

  @IsOptional()
  @ApiProperty({ description: 'The facebook of the user' })
  facebook?: string;

  @IsOptional()
  @ApiProperty({ description: 'The youtube of the user' })
  youtube?: string;

  @IsOptional()
  @ApiProperty({ description: 'The github of the user' })
  github?: string;

  @IsOptional()
  @ApiProperty({ description: 'The website of the user' })
  website?: string;

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested({ each: true })
  @ApiPropertyOptional({
    description: 'The skills of the user (localized)',
    type: [LocalizedStringDto],
  })
  skills?: LocalizedStringDto[];

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested({ each: true })
  @ApiPropertyOptional({
    description: 'The experiences of the user (localized)',
    type: [LocalizedStringDto],
  })
  experiences?: LocalizedStringDto[];

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested({ each: true })
  @ApiPropertyOptional({
    description: 'The education of the user (localized)',
    type: [LocalizedStringDto],
  })
  education?: LocalizedStringDto[];

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested({ each: true })
  @ApiPropertyOptional({
    description: 'The certifications of the user (localized)',
    type: [LocalizedStringDto],
  })
  certifications?: LocalizedStringDto[];

  @IsOptional()
  @Type(() => LocalizedStringDto)
  @Transform(toLocalized)
  @ValidateNested()
  @ApiPropertyOptional({
    description: 'The details of the user (localized)',
    type: LocalizedStringDto,
  })
  details?: LocalizedStringDto;

  @IsOptional()
  @ApiProperty({ description: 'The professional image of the user' })
  proImage?: string;

  @IsOptional()
  @ApiProperty({ description: 'The CV of the user' })
  CV?: string;
}
