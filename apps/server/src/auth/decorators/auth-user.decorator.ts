import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestWithUser } from '../auth.types';

export const AuthUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req: RequestWithUser = ctx.switchToHttp().getRequest();

  return req.user;
});

export const AuthUuid = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const req: RequestWithUser = ctx.switchToHttp().getRequest();

  return req.user.uuid;
});
