import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { jwtConstants } from '../constants/auth.constant';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);
    console.log('🔑 TOKEN reçu:', token);

    if (!token) throw new UnauthorizedException();

    try {
      console.log('🔒 jwtConstants.secret:', jwtConstants.secret);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      console.log('📦 PAYLOAD décodé:', payload);
      const user = await this.userModel.findById(payload.sub);
      console.log('👤 USER trouvé:', user);
      if (!user) throw new NotFoundException();

      request['user'] = payload;
      console.log('✅ req.user attaché:', request['user']);
    } catch (e) {
      console.error('❌ JWT ERROR:', e.message);
      throw new UnauthorizedException();
    }

    return true;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      const user = await this.userModel.findById(payload.sub);

      if (!user) throw new NotFoundException();

      // Check for role

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}

@Injectable()
export class RefreshToken implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
        ignoreExpiration: true,
      });

      request['user'] = payload;
      const user = await this.userModel.findById(payload.sub);

      if (!user) throw new NotFoundException();
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}

const extractTokenFromHeader = (request: Request): string | undefined => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};
