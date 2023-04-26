import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { AxiosError } from 'axios';

import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { Log } from '../logger/logger';

export const LogRequest = () => applyDecorators(UseInterceptors(LoggingInterceptor));

const defaultErrorDataFactory = (error: unknown, args: unknown[]) => {
  if (error instanceof AxiosError) {
    return {
      error: JSON.stringify(error),
      response: error.response?.data,
      args
    };
  }

  return {
    error: JSON.stringify(error),
    args
  };
};

export const LogError = (message: string, context?: string, errorDataFactory = defaultErrorDataFactory) => {
  return (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      const result = originalMethod?.apply(this, args);

      return result.catch((err: any) => {
        Log.error(message, errorDataFactory(err, args), context);
        throw err;
      });
    };

    return descriptor;
  };
};
