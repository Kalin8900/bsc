import { UnauthorizedException } from '@joinus/server/base';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import auth from 'basic-auth';
import { Request } from 'express';

import { BASIC_AUTH_USERS_METADATA } from '../basic-auth.constants';
import { BasicAuthService } from '../basic-auth.service';
import { BasicAuthUser } from '../basic-auth.types';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly authService: BasicAuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const reqUser = auth(req);

    if (!reqUser) throw new UnauthorizedException('No credentials provided');

    const users = this.reflector.getAllAndOverride<BasicAuthUser[]>(BASIC_AUTH_USERS_METADATA, [
      context.getHandler(),
      context.getClass()
    ]);

    const isValid = this.authService.validate({ username: reqUser.name, password: reqUser.pass }, users);

    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return true;
  }
}
