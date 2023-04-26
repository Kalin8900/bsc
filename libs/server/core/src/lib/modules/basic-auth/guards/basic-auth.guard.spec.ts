import { createMock } from '@golevelup/ts-jest';
import { UnauthorizedException } from '@joinus/server/base';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { BASIC_AUTH_USERS_METADATA } from '../basic-auth.constants';
import { BasicAuthService } from '../basic-auth.service';
import { BasicAuthGuard } from './basic-auth.guard';

describe('BasicAuthGuard', () => {
  let service: BasicAuthGuard;
  let reflector: Reflector;
  let authService: BasicAuthService;

  beforeEach(async () => {
    reflector = createMock<Reflector>();
    authService = createMock<BasicAuthService>();
    service = new BasicAuthGuard(reflector, authService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true', () => {
      const context = createMock<ExecutionContext>();
      context.switchToHttp.mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'Basic dGVzdDp0ZXN0'
          }
        })
      } as any);

      const users = [
        {
          username: 'test',
          password: 'test'
        }
      ];

      const spy = jest.spyOn(authService, 'validate').mockReturnValue(true);

      const reflectSpy = jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(users);

      expect(service.canActivate(context)).toEqual(true);
      expect(spy).toHaveBeenCalledWith({ username: 'test', password: 'test' }, users);
      expect(reflectSpy).toHaveBeenCalledWith(BASIC_AUTH_USERS_METADATA, [context.getHandler(), context.getClass()]);
    });

    it('should throw if auth is not provided', () => {
      const context = createMock<ExecutionContext>();
      context.switchToHttp.mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {}
        })
      } as any);

      try {
        service.canActivate(context);
      } catch (e: any) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toEqual('No credentials provided');
      }
    });

    it('should throw if auth is not basic', () => {
      const context = createMock<ExecutionContext>();
      context.switchToHttp.mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'Bearer dGVzdDp0ZXN0'
          }
        })
      } as any);

      try {
        service.canActivate(context);
      } catch (e: any) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toEqual('No credentials provided');
      }
    });

    it('should throw if credentials are invalid', () => {
      const context = createMock<ExecutionContext>();
      context.switchToHttp.mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: 'Basic dGVzdDp0ZXN0'
          }
        })
      } as any);

      const users = [
        {
          username: 'test',
          password: 'test'
        }
      ];

      const spy = jest.spyOn(authService, 'validate').mockReturnValue(false);

      const reflectSpy = jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(users);

      try {
        service.canActivate(context);
      } catch (e: any) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toEqual('Invalid credentials');
      }

      expect(spy).toHaveBeenCalledWith({ username: 'test', password: 'test' }, users);
      expect(reflectSpy).toHaveBeenCalledWith(BASIC_AUTH_USERS_METADATA, [context.getHandler(), context.getClass()]);
    });
  });
});
