import { ValidationException } from '@joinus/server/base';
import { HttpStatus, Injectable, Type } from '@nestjs/common';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { IsArray, validate, validateSync, ValidateNested, ValidationError } from 'class-validator';

@Injectable()
export class Validator {
  /**
   * Validates given object or throws an exception.
   *
   * @throws {ValidationException}
   * @throws {ValidationError}
   */
  public async validateAsync<T extends object>(
    cls: Type<T> | [Type<T>],
    data: T | T[],
    options?: ClassTransformOptions
  ): Promise<T | T[]> {
    if (Array.isArray(cls) && Array.isArray(data)) {
      class ArrayType {
        @IsArray({ message: 'Response is not an array' })
        @ValidateNested({ each: true })
        arr!: T[];

        constructor(arr: T[]) {
          this.arr = arr;
        }
      }

      const items = data.map((item) => plainToInstance(cls[0], item, options));
      const arr = plainToInstance(ArrayType, { arr: items }, options);

      return (await this.validateOrReject(arr)).arr;
    } else if (!Array.isArray(cls) && !Array.isArray(data)) {
      if (data instanceof cls) return this.validateOrReject(data);
      else return this.validateOrReject(plainToInstance(cls, data, options));
    }

    throw new ValidationException('Response type mismatch', HttpStatus.INTERNAL_SERVER_ERROR, [
      'Expected array but got object'
    ]);
  }

  /**
   * Performs sync validation of the given data.
   * Note that this method completely ignores async validations.
   * If you want to properly perform validation you need to call validate method instead.
   *
   * @throws {ValidationError}
   * @throws {ValidationException}
   */
  public validate<T extends object>(cls: Type<T> | [Type<T>], data: T | T[], options?: ClassTransformOptions): T | T[] {
    if (Array.isArray(cls) && Array.isArray(data)) {
      class ArrayType {
        @IsArray({ message: 'Response is not an array' })
        @ValidateNested({ each: true })
        arr!: T[];

        constructor(arr: T[]) {
          this.arr = arr;
        }
      }

      const items = data.map((item) => plainToInstance(cls[0], item, options));
      const arr = plainToInstance(ArrayType, { arr: items }, options);

      return this.validateSyncOrThrow(arr).arr;
    } else if (!Array.isArray(cls) && !Array.isArray(data)) {
      if (data instanceof cls) return this.validateSyncOrThrow(data);
      else return this.validateSyncOrThrow(plainToInstance(cls, data, options));
    }

    throw new ValidationException('Response type mismatch', HttpStatus.INTERNAL_SERVER_ERROR, [
      'Expected array but got object'
    ]);
  }

  /**
   * Maps validation errors to a string array.
   */
  public mapErrors(errors: ValidationError[]) {
    return errors.map((e) => this.errorDescription(e)).flat();
  }

  private errorDescription(error: ValidationError): string[] {
    return Object.values(error.constraints || {})
      .concat(
        Object.values(error.children || {})
          .map((e) => this.errorDescription(e))
          .flat()
      )
      .flat();
  }

  private validateSyncOrThrow<T extends object>(data: T): T {
    const errors = validateSync(data);
    if (errors.length > 0) throw errors;

    return data;
  }

  private async validateOrReject<T extends object>(data: T): Promise<T> {
    return new Promise((resolve, reject) => {
      validate(data, {
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true
      })
        .then((errors) => {
          if (errors.length > 0) {
            reject(errors);
          } else {
            resolve(data);
          }
        })
        .catch(reject);
    });
  }
}
