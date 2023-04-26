import { UnauthorizedException as CoreUnauthorizedException } from '@joinus/server/base';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, UnauthorizedException } from '@nestjs/common';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception.getStatus();

    response.status(status).json(new CoreUnauthorizedException('Unauthorized', [exception.message]).getResponse());
  }
}
