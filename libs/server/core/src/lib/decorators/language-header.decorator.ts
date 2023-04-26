import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const LanguageHeader = createParamDecorator((_key: unknown, ctx: ExecutionContext) => {
  const req: Request = ctx.switchToHttp().getRequest();

  return req.get('Accept-Language') ?? 'en';
});
