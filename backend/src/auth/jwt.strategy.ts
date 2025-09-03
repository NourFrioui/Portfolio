/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import type { Request } from 'express';

export interface JwtPayload {
  username: string;
  sub: string;
  role?: 'admin' | 'user';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ((req: Request): string | null => {
        const authHeader: unknown = req?.headers?.authorization;
        if (
          typeof authHeader !== 'string' ||
          !authHeader.startsWith('Bearer ')
        ) {
          return null;
        }
        return authHeader.slice(7);
      }) as unknown as () => string | null,
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
