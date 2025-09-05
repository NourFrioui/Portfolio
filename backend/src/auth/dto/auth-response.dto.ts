import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'User information without password',
    example: {
      _id: '507f1f77bcf86cd799439011',
      email: 'admin@portfolio.com',
      username: 'admin',
      role: 'ADMIN',
      fullName: 'John Doe',
      title: 'Full Stack Developer',
    },
  })
  user: Record<string, any>;
}

export class RefreshTokenResponseDto {
  @ApiProperty({
    description: 'New JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;
}
