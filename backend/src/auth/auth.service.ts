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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    try {
      const userEmail = email.toLowerCase();

      const existingUser = await this.userModel
        .findOne({ email: userEmail })
        .select('+password');

      //verify credentials
      if (!existingUser) {
        throw new UnauthorizedException('invalid email');
      }
      const verifyPwd = await bcrypt.compare(password, existingUser.password);
      if (!verifyPwd) {
        throw new UnauthorizedException('invalid password');
      }
      const payload = {
        sub: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      };
      const accessToken = await this.jwtService.signAsync(payload);
      await this.updateRefreshToken(existingUser.id, accessToken);

      return {
        profile: existingUser,
        accessToken: accessToken,
      };
    } catch (error) {
      return error;
    }
  }
  async updateRefreshToken(userId: number, token: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      token,
    });
  }

  async refreshTokens(token: string) {
    try {
      const decodedToken = this.jwtService.decode(token);
      if (!decodedToken) {
        throw new ForbiddenException('Invalid token');
      }

      const userId = decodedToken.sub;

      const user = await this.userModel.findById(userId);

      if (!user) {
        throw new ForbiddenException('Access Denied');
      }

      const payload: {
        sub: number;
        email?: string;
      } = {
        sub: user.id,
      };

      if (decodedToken.email) {
        payload.email = decodedToken.email;
      }

      const accessToken = await this.jwtService.signAsync(payload);
      await this.updateRefreshToken(user.id, accessToken);
      return {
        accessToken: accessToken,
      };
    } catch (error) {
      return error;
    }
  }
}
