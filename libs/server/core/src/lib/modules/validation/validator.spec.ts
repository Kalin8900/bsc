import { createMock } from '@golevelup/ts-jest';
import { ValidationException } from '@joinus/server/base';
import { Test, TestingModule } from '@nestjs/testing';
import { IsString, ValidationError } from 'class-validator';

import { Validator } from './validator';

class TestClass {
  @IsString()
  test!: string;
}

describe('Validator', () => {
  let service: Validator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Validator]
    })
      .useMocker(createMock)
      .compile();

    service = module.get<Validator>(Validator);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validation', () => {
    describe('sync', () => {
      it('should validate a single object', () => {
        const test = new TestClass();
        test.test = 'test';
        expect(service.validate(TestClass, test)).toEqual(test);
      });

      it('should validate an array of objects', () => {
        const test = new TestClass();
        test.test = 'test';
        expect(service.validate([TestClass], [test])).toEqual([test]);
      });

      it('should throw an error if the object is invalid', () => {
        try {
          service.validate(TestClass, { test: 1 } as any);
        } catch (e: any) {
          expect(e).toEqual(expect.arrayContaining<ValidationError>([]));
          e.forEach((error: ValidationError) => {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.property).toEqual('test');
            expect(error.constraints).toEqual(expect.objectContaining({ isString: 'test must be a string' }));
          });
        }
      });

      it('should throw an error if the array item is invalid', () => {
        try {
          service.validate([TestClass], [{ test: 1 } as any]);
        } catch (e: any) {
          expect(e).toEqual(expect.arrayContaining<ValidationError>([]));
          e.forEach((error: ValidationError) => {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.property).toEqual('arr');
            if (error.children) {
              error.children.forEach((child: ValidationError) => {
                expect(child.property).toEqual('0');
                if (child.children) {
                  child.children.forEach((innerChild: ValidationError) => {
                    expect(innerChild.property).toEqual('test');
                    expect(innerChild.constraints).toEqual(
                      expect.objectContaining({ isString: 'test must be a string' })
                    );
                  });
                }
              });
            }
          });
        }
      });

      it('should throw an error if the array is not passed', () => {
        try {
          service.validate([TestClass], { test: 1 } as any);
        } catch (e: any) {
          expect(e).toBeInstanceOf(ValidationException);
          expect(e.message).toEqual('Response type mismatch');
          expect(e.errors).toEqual(['Expected array but got object']);
        }
      });
    });

    describe('async', () => {
      it('should validate a single object', async () => {
        const test = new TestClass();
        test.test = 'test';
        expect(await service.validateAsync(TestClass, test)).toEqual(test);
      });

      it('should validate an array of objects', async () => {
        const test = new TestClass();
        test.test = 'test';
        expect(await service.validateAsync([TestClass], [test])).toEqual([test]);
      });

      it('should throw an error if the object is invalid', async () => {
        try {
          await service.validateAsync(TestClass, { test: 1 } as any);
        } catch (e: any) {
          expect(e).toEqual(expect.arrayContaining<ValidationError>([]));
          e.forEach((error: ValidationError) => {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.property).toEqual('test');
            expect(error.constraints).toEqual(expect.objectContaining({ isString: 'test must be a string' }));
          });
        }
      });

      it('should throw an error if the array item is invalid', async () => {
        try {
          await service.validateAsync([TestClass], [{ test: 1 } as any]);
        } catch (e: any) {
          expect(e).toEqual(expect.arrayContaining<ValidationError>([]));
          e.forEach((error: ValidationError) => {
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.property).toEqual('arr');
            if (error.children) {
              error.children.forEach((child: ValidationError) => {
                expect(child.property).toEqual('0');
                if (child.children) {
                  child.children.forEach((innerChild: ValidationError) => {
                    expect(innerChild.property).toEqual('test');
                    expect(innerChild.constraints).toEqual(
                      expect.objectContaining({ isString: 'test must be a string' })
                    );
                  });
                }
              });
            }
          });
        }
      });

      it('should throw an error if the array is not passed', async () => {
        try {
          await service.validateAsync([TestClass], { test: 1 } as any);
        } catch (e: any) {
          expect(e).toBeInstanceOf(ValidationException);
          expect(e.message).toEqual('Response type mismatch');
          expect(e.errors).toEqual(['Expected array but got object']);
        }
      });
    });

    describe('map errors', () => {
      it('should map errors', () => {
        const error = new ValidationError();
        error.property = 'arr';
        error.children = [
          {
            property: '0',
            children: [
              {
                property: 'test',
                constraints: {
                  isString: 'test must be a string'
                }
              }
            ]
          }
        ];

        expect(service.mapErrors([error])).toEqual(['test must be a string']);
      });
    });
  });
});
