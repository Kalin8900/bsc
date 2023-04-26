import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { BASIC_AUTH_USERS_METADATA } from './basic-auth.constants';
import { BasicAuthUser } from './basic-auth.types';
import { BasicAuthGuard } from './guards/basic-auth.guard';

export const BasicAuth = (users: BasicAuthUser[]) =>
  applyDecorators(SetMetadata(BASIC_AUTH_USERS_METADATA, users), UseGuards(BasicAuthGuard));
