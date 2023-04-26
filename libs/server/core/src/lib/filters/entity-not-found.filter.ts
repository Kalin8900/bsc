import { CoreException, NotFoundException } from '@joinus/server/base';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

type ExceptionFactory<T> = (message: string) => T;

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter<T extends CoreException> implements ExceptionFilter {
  constructor(private readonly factory: ExceptionFactory<T>) {}

  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    const exc = this.factory(exception.message);

    response.status(exc.getStatus()).json(exc.getResponse());
  }
}

@Catch(EntityNotFoundError)
export class GlobalEntityNotFoundErrorFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    const exc = new NotFoundException('Entity not found', [exception.message]);

    response.status(exc.getStatus()).json(exc.getResponse());
  }
}
