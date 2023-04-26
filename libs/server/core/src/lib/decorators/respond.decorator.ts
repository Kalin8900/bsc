import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';
import { ClassTransformOptions } from 'class-transformer';

import { ValidateResponse } from './response-validation.decorator';

export interface RespondOptions {
  classTransform: ClassTransformOptions;
  apiResponse: ApiResponseOptions;
  noValidate?: boolean;
}

export const Respond = <T extends object>(cls: Type<T> | [Type<T>], options?: Partial<RespondOptions>) => {
  if (options?.noValidate === true) {
    return applyDecorators(
      ApiResponse({
        type: cls,
        ...options.apiResponse
      })
    );
  }

  return applyDecorators(
    ApiResponse({
      type: cls,
      ...options?.apiResponse
    }),
    ValidateResponse(cls, options?.classTransform)
  );
};
