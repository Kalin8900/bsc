import { ResponseValidationException, ValidationException } from '@joinus/server/base';
import { Type, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { ClassTransformOptions } from 'class-transformer';
import { ValidationError } from 'class-validator';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';

import { VALIDATION_CLASS, VALIDATION_OPTIONS } from '../decorators/validation-metadata.decorator';
import { Validator } from '../modules/validation/validator';

@Injectable()
export class ResponseValidationInterceptor<T extends object> implements NestInterceptor {
  constructor(private readonly reflector: Reflector, private readonly validator: Validator) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T | T[]> {
    return next.handle().pipe(
      switchMap((data: T | T[]) => {
        const cls = this.reflector.getAllAndOverride<Type<T> | [Type<T>]>(VALIDATION_CLASS, [
          context.getHandler(),
          context.getClass()
        ]);

        const options = this.reflector.getAllAndOverride<ClassTransformOptions>(VALIDATION_OPTIONS, [
          context.getHandler(),
          context.getClass()
        ]);

        if (typeof data !== 'object') {
          return throwError(() => new ResponseValidationException('Response cannot be a primitive'));
        }

        return from(this.validator.validateAsync(cls, data, options));
      }),
      catchError((errors) => {
        if (Array.isArray(errors) && errors.every((e) => e instanceof ValidationError)) {
          const errorsArr = this.validator.mapErrors(errors as ValidationError[]);

          throw new ResponseValidationException('Validation Error', errorsArr);
        } else throw errors;
      })
    );
  }
}
