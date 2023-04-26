import { createMock } from '@golevelup/ts-jest';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { from, lastValueFrom } from 'rxjs';

import { MonitoringInterceptor } from './monitoring.interceptor';
import { MonitoringService } from './monitoring.service';

describe('MonitoringInterceptor', () => {
  let service: MonitoringInterceptor;
  let monitoringService: MonitoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitoringInterceptor]
    })
      .useMocker(createMock)
      .compile();

    service = module.get<MonitoringInterceptor>(MonitoringInterceptor);
    monitoringService = module.get<MonitoringService>(MonitoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(monitoringService).toBeDefined();
  });

  it('should increment request count', async () => {
    const context = createMock<ExecutionContext>();
    const callHandler = createMock<CallHandler>();

    const req = {
      url: '/test',
      method: 'GET'
    };

    context.switchToHttp.mockReturnValue({
      getRequest: () => req
    } as any);

    const spy = jest.spyOn(monitoringService, 'incrementRequestCount');

    await service.intercept(context, callHandler);

    expect(spy).toHaveBeenCalledWith(req.url, req.method);
  });

  it('should observe request duration', async () => {
    const context = createMock<ExecutionContext>();
    const callHander = createMock<CallHandler>();

    const req = {
      url: '/test',
      method: 'GET'
    };

    context.switchToHttp.mockReturnValue({
      getRequest: () => req,
      getResponse: () => ({
        statusCode: 200
      })
    } as any);

    callHander.handle.mockReturnValue(from([1]));

    const spy = jest.spyOn(monitoringService, 'observeRequestDuration');

    const $req = await service.intercept(context, callHander);

    await lastValueFrom($req);

    expect(spy).toHaveBeenCalledWith(req.url, req.method, '200', expect.any(Number));
  });
});
