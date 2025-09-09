import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from './dto/login.dto';
import { jwtConstants } from 'src/common/constants/auth.constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    // Find user by email
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (!existingUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = {
      email: existingUser.email,
      sub: existingUser._id,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
    });
    await this.updateRefreshToken(existingUser.id, accessToken);
    return { accessToken };
  }

  async updateRefreshToken(userId: number, token: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ${userId} not found .`);
    }
    user.refreshToken = token;
    console.log('user tokana', user);

    return await user.save();
  }

  async refreshTokens(token: string) {
    try {
      const decodedToken = this.jwtService.decode(token);
      if (!decodedToken || typeof decodedToken !== 'object') {
        throw new ForbiddenException('Invalid token');
      }

      const userId = decodedToken.sub;

      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new ForbiddenException('Access Denied');
      }

      const payload: {
        sub: string;
        email?: string;
        role: string;
      } = {
        sub: user.id,
        role: user.role,
      };

      if (typeof decodedToken.email === 'string') {
        payload.email = decodedToken.email;
      }

      const accessToken = await this.jwtService.signAsync(payload);
      await this.updateRefreshToken(user.id, accessToken);
      return { access_token: accessToken };
    } catch (error) {
      return error.message;
    }
  }
}
