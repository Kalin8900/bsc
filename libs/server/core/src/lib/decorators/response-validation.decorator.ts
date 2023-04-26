import { applyDecorators, Type, UseInterceptors } from '@nestjs/common';
import { ClassTransformOptions } from '@nestjs/common/interfaces/external/class-transform-options.interface';

import { ResponseValidationInterceptor } from '../interceptors/response-validation.interceptor';
import { ValidationMetadata } from './validation-metadata.decorator';

export const ValidateResponse = <T extends object>(cls: Type<T> | [Type<T>], options?: ClassTransformOptions) =>
  applyDecorators(ValidationMetadata(cls, options), UseInterceptors(ResponseValidationInterceptor));
