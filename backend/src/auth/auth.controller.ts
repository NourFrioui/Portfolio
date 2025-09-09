import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  UnauthorizedException,
  Request,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard, RefreshToken } from 'src/common/guards/auth.guard';
import { UsersService } from 'src/users/users.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user with email and password',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto): Promise<any> {
    return await this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @Get('profile')
  @ApiResponse({
    status: 200,
    type: User,
  })
  @UseGuards(AuthGuard)
  async getProfile(@Request() req) {
    const userId = req.user.sub;
    const user = await this.usersService.getProfile(userId);

    return user;
  }

  @ApiBearerAuth()
  @UseGuards(RefreshToken)
  @Get('refresh')
  refreshTokens(@Req() req) {
    const token = this.extractTokenFromRequest(req);
    console.log('refresh token:', token);
    if (!token) throw new UnauthorizedException();
    return this.authService.refreshTokens(token);
  }

  private extractTokenFromRequest = (req: Request): string | undefined => {
    const [type, token] = req.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  };
}
