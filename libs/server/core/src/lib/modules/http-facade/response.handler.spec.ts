import { createMock } from '@golevelup/ts-jest';
import { ValidationException } from '@joinus/server/base';
import { IsString, MinLength, ValidationError } from 'class-validator';

import { Validator } from '../validation/validator';
import { ResponseHandler } from './response.handler';

class TestResponse {
  @IsString()
  @MinLength(3)
  test!: string;
}

describe('ResponseHandler', () => {
  let service: ResponseHandler<TestResponse>;
  let validator: Validator;

  beforeEach(async () => {
    validator = createMock<Validator>();
  });

  it('should be defined', () => {
    service = new ResponseHandler<TestResponse>(
      {
        data: {
          test: 'test'
        }
      } as any,
      validator
    );

    expect(service).toBeDefined();
    expect(validator).toBeDefined();
  });

  describe('validate', () => {
    it('should validate', () => {
      service = new ResponseHandler<TestResponse>(
        {
          data: {
            test: 'test'
          }
        } as any,
        validator
      );

      const spy = jest.spyOn(validator, 'validate');

      const handler = service.validate(TestResponse, {
        enableCircularCheck: true
      });

      expect(handler).toEqual(service);
      expect(spy).toHaveBeenCalledWith(TestResponse, service.response.data, {
        enableCircularCheck: true
      });
    });

    it('should throw if data is invalid', () => {
      service = new ResponseHandler<TestResponse>(
        {
          data: {
            test: 1
          }
        } as any,
        validator
      );

      const spy = jest.spyOn(validator, 'validate').mockImplementation(() => {
        const valError = new ValidationError();
        valError.property = 'test';
        valError.constraints = {
          isString: 'test must be a string',
          minLength: 'test must be longer than or equal to 3 characters'
        };

        // eslint-disable-next-line no-throw-literal
        throw [valError];
      });

      jest
        .spyOn(validator, 'mapErrors')
        .mockReturnValue(['test must be a string', 'test must be longer than or equal to 3 characters']);

      try {
        service.validate(TestResponse, {
          enableCircularCheck: true
        });
      } catch (e: any) {
        expect(e).toBeInstanceOf(ValidationException);
        expect(e.message).toEqual('HttpFacade - Validation Error');
        expect(e.errors).toEqual(['test must be a string', 'test must be longer than or equal to 3 characters']);
      }

      expect(spy).toHaveBeenCalledWith(TestResponse, service.response.data, {
        enableCircularCheck: true
      });
    });
  });

  describe('validate async', () => {
    it('should validate', async () => {
      service = new ResponseHandler<TestResponse>(
        {
          data: {
            test: 'test'
          }
        } as any,
        validator
      );

      const spy = jest.spyOn(validator, 'validateAsync');

      const handler = await service.validateAsync(TestResponse, {
        enableCircularCheck: true
      });

      expect(handler).toEqual(service);
      expect(spy).toHaveBeenCalledWith(TestResponse, service.response.data, {
        enableCircularCheck: true
      });
    });

    it('should throw if data is invalid', async () => {
      service = new ResponseHandler<TestResponse>(
        {
          data: {
            test: 1
          }
        } as any,
        validator
      );

      const spy = jest.spyOn(validator, 'validateAsync').mockImplementation(() => {
        const valError = new ValidationError();
        valError.property = 'test';
        valError.constraints = {
          isString: 'test must be a string',
          minLength: 'test must be longer than or equal to 3 characters'
        };

        // eslint-disable-next-line no-throw-literal
        throw [valError];
      });

      jest
        .spyOn(validator, 'mapErrors')
        .mockReturnValue(['test must be a string', 'test must be longer than or equal to 3 characters']);

      try {
        await service.validateAsync(TestResponse, {
          enableCircularCheck: true
        });
      } catch (e: any) {
        expect(e).toBeInstanceOf(ValidationException);
        expect(e.message).toEqual('HttpFacade - Validation Error');
        expect(e.errors).toEqual(['test must be a string', 'test must be longer than or equal to 3 characters']);
      }

      expect(spy).toHaveBeenCalledWith(TestResponse, service.response.data, {
        enableCircularCheck: true
      });
    });
  });

  describe('map', () => {
    it('should map', () => {
      service = new ResponseHandler<TestResponse>(
        {
          data: {
            test: 'test'
          }
        } as any,
        validator
      );

      const handler = service.map((data) => {
        data.test = 'test2';

        return data;
      });

      expect(handler.data.test).toEqual('test2');
    });

    it('should map async', async () => {
      service = new ResponseHandler<TestResponse>(
        {
          data: {
            test: 'test'
          }
        } as any,
        validator
      );

      const handler = await service.mapAsync(async (data) => {
        data.test = 'test2';

        return data;
      });

      expect(handler.data.test).toEqual('test2');
    });
  });
});
