import { CoreException, UnknownException } from '@joinus/server/base';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EntityNotFoundError } from 'typeorm';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof CoreException) return throwError(() => err);
        else if (err instanceof AxiosError) return throwError(() => err); // FIXME: handle axios errors
        else if (err instanceof EntityNotFoundError) return throwError(() => err);
        else return throwError(() => new UnknownException(err?.message, err?.errors));
      })
    );
  }
}
