import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';

import { BasicGuard, JwtGuard } from '../guards';

export const AuthGuard = (type: 'jwt' | 'basic' = 'jwt') => {
  switch (type) {
    case 'jwt':
      return applyDecorators(UseGuards(JwtGuard), ApiBearerAuth(), ApiCookieAuth());
    case 'basic':
      return applyDecorators(UseGuards(BasicGuard), ApiBasicAuth('basic'));
  }
};
