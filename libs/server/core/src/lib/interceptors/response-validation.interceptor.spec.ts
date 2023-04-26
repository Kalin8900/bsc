import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ResponseValidationException } from '@joinus/server/base';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { IsString, ValidationError } from 'class-validator';
import { from } from 'rxjs';

import { VALIDATION_CLASS } from '../decorators/validation-metadata.decorator';
import { Validator } from '../modules/validation/validator';
import { ResponseValidationInterceptor } from './response-validation.interceptor';

class TestClass {
  @IsString()
  test!: string;
}

describe('ResponseValidationInterceptor', () => {
  let service: ResponseValidationInterceptor<TestClass>;
  let validator: Validator;
  let reflector: Reflector;
  let context: DeepMocked<ExecutionContext>;
  let handler: DeepMocked<CallHandler>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseValidationInterceptor]
    })
      .useMocker(createMock)
      .compile();

    service = module.get<ResponseValidationInterceptor<TestClass>>(ResponseValidationInterceptor);
    validator = module.get<Validator>(Validator);
    reflector = module.get<Reflector>(Reflector);
    context = createMock<ExecutionContext>();
    handler = createMock<CallHandler>();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(validator).toBeDefined();
  });

  describe('intercept', () => {
    it('should validate response', async () => {
      const test = new TestClass();
      test.test = 'test';

      handler.handle.mockReturnValue(from([test]));

      const spy = jest.spyOn(validator, 'validateAsync').mockResolvedValue(test);

      const reflectSpy = jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
        if (key === VALIDATION_CLASS) return TestClass;

        return undefined;
      });

      const $res = service.intercept(context, handler);

      const sub = $res.subscribe((res) => {
        expect(res).toEqual(test);
      });

      expect(spy).toHaveBeenCalledWith(TestClass, test, undefined);
      expect(reflectSpy).toHaveBeenCalledWith(VALIDATION_CLASS, [context.getHandler(), context.getClass()]);

      sub.unsubscribe();
    });

    it('should throw if data is not an object', async () => {
      const test = 'test';

      handler.handle.mockReturnValue(from([test]));

      const reflectSpy = jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
        if (key === VALIDATION_CLASS) return TestClass;

        return undefined;
      });

      const $res = service.intercept(context, handler);

      const sub = $res.subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(ResponseValidationException);
          expect(err.message).toBe('Response cannot be a primitive');
        }
      });

      expect(reflectSpy).toHaveBeenCalledWith(VALIDATION_CLASS, [context.getHandler(), context.getClass()]);

      sub.unsubscribe();
    });

    it('should throw if data is not valid', async () => {
      const test = new TestClass();
      test.test = 'test';

      handler.handle.mockReturnValue(from([test]));

      const spy = jest.spyOn(validator, 'validateAsync').mockImplementation(() => {
        const err = new ValidationError();
        // eslint-disable-next-line no-throw-literal
        throw [err];
      });

      const reflectSpy = jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key) => {
        if (key === VALIDATION_CLASS) return TestClass;

        return undefined;
      });

      const $res = service.intercept(context, handler);

      const sub = $res.subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(ResponseValidationException);
          expect(err.message).toBe('Validation Error');
        }
      });

      expect(spy).toHaveBeenCalledWith(TestClass, test, undefined);
      expect(reflectSpy).toHaveBeenCalledWith(VALIDATION_CLASS, [context.getHandler(), context.getClass()]);

      sub.unsubscribe();
    });
  });
});
