import { UnauthorizedException } from '@joinus/server/base';
import { AuthConfigService } from '@joinus/server/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '../../user/user.service';
import { AccessCookie } from '../auth.constants';
import { TokenPayload } from '../auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly authConfigService: AuthConfigService, private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies[AccessCookie] || request.headers.authorization?.split('Bearer ')[1];
        }
      ]),
      secretOrKey: authConfigService.jwt.secret
    });
  }

  async validate({ uuid }: TokenPayload) {
    try {
      return this.userService.getOne(uuid, ['auth']);
    } catch {
      throw new UnauthorizedException('InvalidCredentials', ['Invalid token']);
    }
  }
}
