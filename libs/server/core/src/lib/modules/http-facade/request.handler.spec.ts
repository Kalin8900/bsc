import { createMock } from '@golevelup/ts-jest';
import { AxiosError } from 'axios';

import { HttpClient } from '../http-client';
import { Validator } from '../validation/validator';
import { RequestHandler } from './request.handler';
import { ResponseHandler } from './response.handler';

const url = '/test';
const baseURL = 'http://localhost:3000';

describe('RequestHandler', () => {
  let service: RequestHandler;
  let httpClient: HttpClient;
  let validator: Validator;

  beforeEach(async () => {
    httpClient = createMock<HttpClient>();
    validator = createMock<Validator>();
    service = new RequestHandler(
      {
        baseURL
      },
      httpClient,
      validator
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(validator).toBeDefined();
    expect(httpClient).toBeDefined();
  });

  it('should get', async () => {
    const spy = jest.spyOn(httpClient, 'get').mockResolvedValue({
      data: {
        test: 'test'
      }
    } as any);

    const responseHandler = await service.get('/test', { url });

    expect(spy).toHaveBeenCalledWith('/test', {
      baseURL,
      url
    });
    expect(responseHandler).toBeInstanceOf(ResponseHandler);
    expect(responseHandler.response.data).toEqual({
      test: 'test'
    });
  });

  it('should post', async () => {
    const spy = jest.spyOn(httpClient, 'post').mockResolvedValue({
      data: {
        test: 'test'
      }
    } as any);

    const responseHandler = await service.post('/test', { test: 'test' }, { url });

    expect(spy).toHaveBeenCalledWith(
      '/test',
      { test: 'test' },
      {
        baseURL,
        url
      }
    );
    expect(responseHandler).toBeInstanceOf(ResponseHandler);
    expect(responseHandler.response.data).toEqual({
      test: 'test'
    });
  });

  it('should put', async () => {
    const spy = jest.spyOn(httpClient, 'put').mockResolvedValue({
      data: {
        test: 'test'
      }
    } as any);

    const responseHandler = await service.put('/test', { test: 'test' }, { url });

    expect(spy).toHaveBeenCalledWith(
      '/test',
      { test: 'test' },
      {
        baseURL,
        url
      }
    );
    expect(responseHandler).toBeInstanceOf(ResponseHandler);
    expect(responseHandler.response.data).toEqual({
      test: 'test'
    });
  });

  it('should patch', async () => {
    const spy = jest.spyOn(httpClient, 'patch').mockResolvedValue({
      data: {
        test: 'test'
      }
    } as any);

    const responseHandler = await service.patch('/test', { test: 'test' }, { url });

    expect(spy).toHaveBeenCalledWith(
      '/test',
      { test: 'test' },
      {
        baseURL,
        url
      }
    );
    expect(responseHandler).toBeInstanceOf(ResponseHandler);
    expect(responseHandler.response.data).toEqual({
      test: 'test'
    });
  });

  it('should delete', async () => {
    const spy = jest.spyOn(httpClient, 'delete').mockResolvedValue({
      data: {
        test: 'test'
      }
    } as any);

    const responseHandler = await service.delete('/test', { url });

    expect(spy).toHaveBeenCalledWith('/test', {
      baseURL,
      url
    });
    expect(responseHandler).toBeInstanceOf(ResponseHandler);
    expect(responseHandler.response.data).toEqual({
      test: 'test'
    });
  });

  it('should throw AxiosError', async () => {
    const spy = jest.spyOn(httpClient, 'get').mockRejectedValue(new AxiosError('test', '500', {}));

    try {
      const res = await service.get('/test', { url });

      expect(res).toBeUndefined();
    } catch (e: any) {
      expect(e).toBeInstanceOf(AxiosError);
      expect(e.message).toEqual('test');
      expect(e.code).toEqual('500');
    }

    expect(spy).toHaveBeenCalledWith('/test', {
      baseURL,
      url
    });
  });
});
