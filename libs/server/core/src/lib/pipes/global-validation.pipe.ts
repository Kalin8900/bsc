import { RequestValidationException } from '@joinus/server/base';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: false
      },
      validateCustomDecorators: true,
      forbidUnknownValues: true,
      exceptionFactory: GlobalValidationPipe.exceptionFactory
    });
  }

  private static exceptionFactory(errors: ValidationError[]) {
    return new RequestValidationException('Request validation failed', GlobalValidationPipe.mapErrors(errors));
  }

  public static mapErrors(errors: ValidationError[]) {
    return errors.map((e) => this.errorDescription(e)).flat();
  }

  private static errorDescription(error: ValidationError): string[] {
    return Object.values(error.constraints || {})
      .concat(
        Object.values(error.children || {})
          .map((e) => this.errorDescription(e))
          .flat()
      )
      .flat();
  }
}
