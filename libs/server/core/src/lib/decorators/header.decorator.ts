import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Header = createParamDecorator((key: string, ctx: ExecutionContext) => {
  const req: Request = ctx.switchToHttp().getRequest();

  return req.header(key);
});
