import { ValidationException } from '@joinus/server/base';
import { HttpStatus, Type } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ClassTransformOptions } from 'class-transformer';
import { ValidationError } from 'class-validator';

import { Validator } from '../validation/validator';

export class ResponseHandler<T extends object> {
  public readonly data: T;

  constructor(public readonly response: AxiosResponse<T>, private readonly validator: Validator) {
    this.data = response.data;
  }

  /**
   * Validates given object or throws an exception.
   *
   * @throws ValidationException
   */
  public async validateAsync(cls: Type<T> | [Type<T>], options?: ClassTransformOptions): Promise<this> {
    try {
      await this.validator.validateAsync(cls, this.data, options);

      return this;
    } catch (errors) {
      if (Array.isArray(errors) && errors.every((e) => e instanceof ValidationError))
        throw new ValidationException(
          'HttpFacade - Validation Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
          this.validator.mapErrors(errors as ValidationError[])
        );
      else throw new ValidationException('HttpFacade - Unknown Validation Error');
    }
  }

  /**
   * Validates given object or throws an exception.
   * Note that this method completely ignores async validations.
   *
   * @throws ValidationException
   */
  public validate(cls: Type<T> | [Type<T>], options?: ClassTransformOptions): this {
    try {
      this.validator.validate(cls, this.data, options);

      return this;
    } catch (errors) {
      if (Array.isArray(errors) && errors.every((e) => e instanceof ValidationError))
        throw new ValidationException(
          'HttpFacade - Validation Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
          this.validator.mapErrors(errors as ValidationError[])
        );
      else throw new ValidationException('HttpFacade - Unknown Validation Error');
    }
  }

  /**
   * Maps response data to given format.
   */
  public map<U extends object>(mapper: (data: T) => U): ResponseHandler<U> {
    return new ResponseHandler(
      {
        ...this.response,
        data: mapper(this.data)
      },
      this.validator
    );
  }

  /**
   * Asynchronously maps response data to given format.
   */
  public async mapAsync<U extends object>(mapper: (data: T) => Promise<U>) {
    return new ResponseHandler(
      {
        ...this.response,
        data: await mapper(this.data)
      },
      this.validator
    );
  }
}
