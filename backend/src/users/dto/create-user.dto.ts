import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { UserRole } from 'src/common/enums/user-role.enum';

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
  @ApiProperty({ description: 'The address of the user' })
  address?: string;

  @IsOptional()
  @ApiProperty({ description: 'The city of the user' })
  city?: string;

  @IsOptional()
  @ApiProperty({ description: 'The country of the user' })
  country?: string;

  @IsOptional()
  @ApiProperty({ description: 'The zip code of the user' })
  zipCode?: string;

  @IsOptional()
  @ApiProperty({ description: 'The state of the user' })
  state?: string;

  @IsOptional()
  @ApiProperty({ description: 'The company of the user' })
  company?: string;

  @IsOptional()
  @ApiProperty({ description: 'The job title of the user' })
  jobTitle?: string;

  @IsOptional()
  @ApiProperty({ description: 'The bio of the user' })
  bio?: string;

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
  @ApiProperty({ description: 'The skills of the user' })
  skills?: string[];

  @IsOptional()
  @ApiProperty({ description: 'The experiences of the user' })
  experiences?: string[];

  @IsOptional()
  @ApiProperty({ description: 'The education of the user' })
  education?: string[];

  @IsOptional()
  @ApiProperty({ description: 'The certifications of the user' })
  certifications?: string[];

  @IsOptional()
  @ApiProperty({ description: 'The details of the user' })
  details?: string;

  @IsOptional()
  @ApiProperty({ description: 'The professional image of the user' })
  proImage?: string;

  @IsOptional()
  @ApiProperty({ description: 'The CV of the user' })
  CV?: string;
}
