import { CoreException } from '@joinus/server/base';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();
    const status = exception.getStatus();

    if (!(exception instanceof CoreException)) {
      this.logger.error('Exception is not instance of CoreException', exception.stack);
    }

    return response.status(status).json(exception.getResponse());
  }
}
