import { createMock } from '@golevelup/ts-jest';
import { Injectable } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { MetricsManager } from './metrics.manager';
import { Health, MonitoringDependency } from './monitoring-dependency.interface';
import {
  Dependency,
  DEPENDENCY_METADATA_KEY,
  MetricUpdater,
  METRIC_UPDATER_METADATA_KEY
} from './monitoring.decorator';
import { MonitoringExplorer } from './monitoring.explorer';

@Injectable()
@Dependency('dummy')
class DummyProvider implements MonitoringDependency {
  public isUp() {
    return Health.UP;
  }

  @MetricUpdater()
  public dummyMethod() {
    return 'dummy';
  }
}

@Injectable()
@Dependency('dummy2')
class DummyProviderWithoutDependency {}

@Injectable()
export class DummyProviderWithArguments {
  @MetricUpdater()
  public dummyMethod(_arg1: string, _arg2: string) {
    return 'dummy';
  }
}

describe('MonitoringExplorer', () => {
  let service: MonitoringExplorer;
  let reflector: Reflector;
  let discoveryService: DiscoveryService;
  let metadataScanner: MetadataScanner;
  let metricsManager: MetricsManager;
  let dummyProvider: DummyProvider;
  let dummyProviderWithoutDependency: DummyProviderWithoutDependency;
  let dummyProviderWithArguments: DummyProviderWithArguments;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonitoringExplorer, DummyProvider, DummyProviderWithoutDependency, DummyProviderWithArguments]
    })
      .useMocker(createMock)
      .compile();

    service = module.get<MonitoringExplorer>(MonitoringExplorer);
    reflector = module.get<Reflector>(Reflector);
    discoveryService = module.get<DiscoveryService>(DiscoveryService);
    metadataScanner = module.get<MetadataScanner>(MetadataScanner);
    metricsManager = module.get<MetricsManager>(MetricsManager);
    dummyProvider = module.get<DummyProvider>(DummyProvider);
    dummyProviderWithoutDependency = module.get<DummyProviderWithoutDependency>(DummyProviderWithoutDependency);
    dummyProviderWithArguments = module.get<DummyProviderWithArguments>(DummyProviderWithArguments);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(reflector).toBeDefined();
    expect(discoveryService).toBeDefined();
    expect(metadataScanner).toBeDefined();
    expect(metricsManager).toBeDefined();
  });

  it('should scan for providers', () => {
    const spy = jest.spyOn(discoveryService, 'getProviders');
    service.onModuleInit();
    expect(spy).toHaveBeenCalled();
  });

  describe('dependencies', () => {
    it('should scan for dependencies', () => {
      jest.spyOn(discoveryService, 'getProviders').mockReturnValue([
        {
          instance: dummyProvider,
          metatype: DummyProvider
        }
      ] as any);

      const spy = jest.spyOn(reflector, 'get');

      service.onModuleInit();
      expect(spy).toHaveBeenCalledWith(DEPENDENCY_METADATA_KEY, DummyProvider);
    });

    it('should throw error when dependency does not have isUp method', () => {
      jest.spyOn(discoveryService, 'getProviders').mockReturnValue([
        {
          instance: dummyProviderWithoutDependency,
          metatype: DummyProviderWithoutDependency
        }
      ] as any);

      expect(() => service.onModuleInit()).toThrowError('Dependency must implement MonitoringDependency interface');
    });

    it('should add dependency to dependencies map', () => {
      jest.spyOn(discoveryService, 'getProviders').mockReturnValue([
        {
          instance: dummyProvider,
          metatype: DummyProvider
        }
      ] as any);

      jest.spyOn(metricsManager, 'addDependency');

      jest.spyOn(reflector, 'get').mockReturnValue('dummy');

      service.onModuleInit();

      expect(metricsManager.addDependency).toHaveBeenCalledWith({
        name: 'dummy',
        instance: dummyProvider
      });
    });
  });

  describe('metrics', () => {
    beforeEach(() => {
      jest.spyOn(discoveryService, 'getProviders').mockReturnValue([
        {
          instance: dummyProvider,
          metatype: DummyProvider
        }
      ] as any);
    });

    it('should scan for metrics', () => {
      const spy = jest.spyOn(metadataScanner, 'scanFromPrototype');

      service.onModuleInit();
      expect(spy).toHaveBeenCalledWith(dummyProvider, Object.getPrototypeOf(dummyProvider), expect.any(Function));
    });

    it('should throw error when register method has arguments', () => {
      jest.spyOn(discoveryService, 'getProviders').mockReturnValue([
        {
          instance: dummyProviderWithArguments,
          metatype: DummyProviderWithArguments
        }
      ] as any);

      jest.spyOn(metadataScanner, 'scanFromPrototype').mockImplementation((_instance, _prototype, callback) => {
        callback('dummyMethod');

        return [];
      });

      jest.spyOn(reflector, 'get').mockImplementation((key, _target) => {
        if (key === METRIC_UPDATER_METADATA_KEY) {
          return true;
        }

        return undefined;
      });

      expect(() => service.onModuleInit()).toThrowError('Metric updater must not have any arguments');
    });

    it('should add metric to metrics map', () => {
      jest.spyOn(metadataScanner, 'scanFromPrototype').mockImplementation((_instance, _prototype, callback) => {
        callback('dummyMethod');

        return [];
      });

      jest.spyOn(reflector, 'get').mockImplementation((key, _target) => {
        if (key === METRIC_UPDATER_METADATA_KEY) {
          return true;
        }

        return undefined;
      });

      jest.spyOn(metricsManager, 'addCustomMetricUpdater');

      service.onModuleInit();

      expect(metricsManager.addCustomMetricUpdater).toHaveBeenCalledWith({
        methodName: 'dummyMethod',
        instance: dummyProvider
      });
    });
  });
});
