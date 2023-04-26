import { NotFoundException as CoreNotFoundException } from '@joinus/server/base';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, NotFoundException } from '@nestjs/common';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception.getStatus();

    return response
      .status(status)
      .json(new CoreNotFoundException('This route does not exist', [exception.message]).getResponse());
  }
}
