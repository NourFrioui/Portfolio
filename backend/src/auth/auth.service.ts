import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: any }> {
    const { email, password } = loginDto;

    // Find user by email
    const existingUser = await this.userModel.findOne({ email }).exec();
    if (!existingUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { email: existingUser.email, sub: existingUser._id.toString() };
    const access_token = this.jwtService.sign(payload);

    // Remove password from response
    const userObject = existingUser.toObject();
    const { password: _, ...userWithoutPassword } = userObject;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

  async updateRefreshToken(userId: string, token: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      token,
    });
  }

  async refreshTokens(token: string): Promise<{ accessToken: string }> {
    const decodedToken = this.jwtService.decode(token) as any;
    if (!decodedToken || !decodedToken.sub) {
      throw new ForbiddenException('Invalid token');
    }

    const userId = decodedToken.sub;
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    await this.updateRefreshToken(user._id.toString(), accessToken);
    
    return {
      accessToken,
    };
  }
}
