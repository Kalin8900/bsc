import { createMock } from '@golevelup/ts-jest';
import { MonitoringConfigService } from '@joinus/server/config';
import { Test, TestingModule } from '@nestjs/testing';

import { MetricsManager } from './metrics.manager';
import { MetricsRegistry } from './metrics.registry';

jest.mock('prom-client');

const promClient = jest.requireMock('prom-client');

// jest.useFakeTimers();

describe('MetricsManager', () => {
  let service: MetricsManager;
  let metricsRegistry: MetricsRegistry;
  let monitoringConfigService: MonitoringConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetricsManager]
    })
      .useMocker(createMock)
      .compile();

    service = module.get<MetricsManager>(MetricsManager);
    metricsRegistry = module.get<MetricsRegistry>(MetricsRegistry);
    monitoringConfigService = module.get<MonitoringConfigService>(MonitoringConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(metricsRegistry).toBeDefined();
    expect(monitoringConfigService).toBeDefined();
  });

  it('should register defualt metrics', () => {
    const spy = jest.spyOn(promClient, 'collectDefaultMetrics');

    new MetricsManager(metricsRegistry, monitoringConfigService);

    expect(spy).toHaveBeenCalled();
  });

  it('should register metrics', () => {
    const spy = jest.spyOn(service, 'addCustomMetricUpdater');

    expect(
      service.addCustomMetricUpdater({
        instance: {},
        methodName: 'metricName'
      })
    ).toEqual(1);

    expect(spy).toHaveBeenCalled();
  });

  it('should register dependencies', () => {
    const spy = jest.spyOn(service, 'addDependency');

    expect(
      service.addDependency({
        instance: {
          isUp: jest.fn()
        },
        name: 'dependencyName'
      })
    ).toEqual(1);

    expect(spy).toHaveBeenCalled();
  });
});
