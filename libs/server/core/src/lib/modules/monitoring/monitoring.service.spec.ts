import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { MetricsRegistry } from './metrics.registry';
import { MonitoringService } from './monitoring.service';

describe('MonitoringService', () => {
  let service: MonitoringService;
  let metricsRegistry: MetricsRegistry;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitoringService]
    })
      .useMocker(createMock)
      .compile();

    service = module.get<MonitoringService>(MonitoringService);
    metricsRegistry = module.get<MetricsRegistry>(MetricsRegistry);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(metricsRegistry).toBeDefined();
  });

  it('should return metrics', async () => {
    const spy = jest.spyOn(metricsRegistry, 'metrics').mockResolvedValue('metrics');

    expect(await service.getMetrics()).toEqual('metrics');
    expect(spy).toHaveBeenCalled();
  });

  it('should return health', () => {
    const spy = jest.spyOn(metricsRegistry, 'serviceHealth').mockReturnValue('UP');
    const spy2 = jest.spyOn(metricsRegistry, 'dependenciesHealth').mockReturnValue({ db: 'UP' });

    expect(service.getHealth()).toEqual({
      health: 'UP',
      resources: {
        db: 'UP'
      }
    });
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should return info', () => {
    expect(service.getInfo()).toBeDefined();
  });

  it('should increment request count', () => {
    jest.mocked(metricsRegistry).requestCount = {
      inc: jest.fn()
    } as any;

    const spy = jest.spyOn(metricsRegistry.requestCount, 'inc');

    service.incrementRequestCount('path', 'method');
    expect(spy).toHaveBeenCalledWith({ path: 'path', method: 'method' });
  });

  it('should observe request duration', () => {
    jest.mocked(metricsRegistry).requestDuration = {
      observe: jest.fn()
    } as any;
    jest.mocked(metricsRegistry).requestDurationBuckets = {
      observe: jest.fn()
    } as any;

    const spy = jest.spyOn(metricsRegistry.requestDuration, 'observe');
    const spy2 = jest.spyOn(metricsRegistry.requestDurationBuckets, 'observe');

    service.observeRequestDuration('path', 'method', 'status', 100);
    expect(spy).toHaveBeenCalledWith({ path: 'path', method: 'method', status: 'status' }, 100);
    expect(spy2).toHaveBeenCalledWith({ path: 'path', method: 'method', status: 'status' }, 100);
  });
});
