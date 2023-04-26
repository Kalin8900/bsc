import { createMock } from '@golevelup/ts-jest';
import { UnauthorizedException, UnknownException } from '@joinus/server/base';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { throwError } from 'rxjs';

import { ErrorsInterceptor } from './errors.interceptor';

describe('Errors interceptor', () => {
  let errorsInterceptor: ErrorsInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorsInterceptor]
    })
      .useMocker(createMock)
      .compile();

    errorsInterceptor = module.get<ErrorsInterceptor>(ErrorsInterceptor);
  });

  it('should be defined', () => {
    expect(errorsInterceptor).toBeDefined();
  });

  it('should throw UnauthorizedException', async () => {
    const context = createMock<ExecutionContext>();
    const callHandler = createMock<CallHandler>();

    callHandler.handle.mockReturnValue(throwError(() => new UnauthorizedException('Unauthorized')));

    const $req = errorsInterceptor.intercept(context, callHandler);

    const sub = $req.subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(UnauthorizedException);
        expect(err.message).toBe('Unauthorized');
      }
    });

    sub.unsubscribe();
  });

  it('should throw UnknownException', async () => {
    const context = createMock<ExecutionContext>();
    const callHandler = createMock<CallHandler>();

    callHandler.handle.mockReturnValue(throwError(() => new Error('unknown')));

    const $req = errorsInterceptor.intercept(context, callHandler);

    const sub = $req.subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(UnknownException);
        expect(err.message).toBe('unknown');
      }
    });

    sub.unsubscribe();
  });
});
