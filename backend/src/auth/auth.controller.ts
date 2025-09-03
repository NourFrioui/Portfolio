/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOkResponse({
    description: 'Successfully signed in',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            access_token: {
              type: 'string',
              example: { access_token: 'access-token' },
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request: Validation failed',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 400 },
            error: { type: 'string', example: 'Bad Request' },
            message: {
              type: 'array',
              items: { type: 'string' },
              example: ['Invalid email format'],
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Bad Request: Validation failed',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            statusCode: { type: 'number', example: 401 },
            error: { type: 'string', example: 'Unauthorized' },
            message: {
              type: 'array',
              items: { type: 'string' },
              example: 'Invalid email or password',
            },
          },
        },
      },
    },
  })
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    console.log('login', loginDto);

    return await this.authService.login(loginDto.email, loginDto.password);
  }

  /*@ApiBearerAuth()
  @UseGuards(RefreshToken)
  @Get('refresh')
  refreshTokens(@Req() req) {
    const token = this.extractTokenFromRequest(req);
    console.log('refresh token:', token);
    return this.authService.refreshTokens(token);
  }
  private extractTokenFromRequest = (req: Request): string | undefined => {
    const [type, token] = req.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  };*/
}
