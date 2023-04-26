import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

import { Log } from '../../logger/logger';
import { MetricsManager } from './metrics.manager';
import { DEPENDENCY_METADATA_KEY, METRIC_UPDATER_METADATA_KEY } from './monitoring.decorator';

@Injectable()
export class MonitoringExplorer implements OnModuleInit {
  private readonly logger = new Log('MonitoringExplorer');

  constructor(
    private readonly reflector: Reflector,
    private readonly discoveryService: DiscoveryService,
    private readonly metricsManager: MetricsManager,
    private readonly metadataScanner: MetadataScanner
  ) {}

  onModuleInit() {
    this.explore();
  }

  private explore() {
    const instanceWrappers: InstanceWrapper[] = this.discoveryService.getProviders();

    instanceWrappers.forEach((wrapper: InstanceWrapper) => {
      const { instance, metatype } = wrapper;

      if (!instance || !(metatype as any)) {
        return;
      }

      this.exploreDependency(wrapper);
      this.exploreCustomMetricUpdaters(wrapper);
    });
  }

  private exploreCustomMetricUpdaters({ instance }: InstanceWrapper) {
    this.metadataScanner.scanFromPrototype(instance, Object.getPrototypeOf(instance), (methodName: string) => {
      const methodRef = instance[methodName] as (...args: any[]) => void;
      const isCustomMetricSet = this.reflector.get<boolean>(METRIC_UPDATER_METADATA_KEY, methodRef);

      if (!isCustomMetricSet) {
        return;
      }

      if (methodRef.length) {
        this.logger.error(`Custom metric updater ${methodName} must not have any arguments`);
        throw new Error('Metric updater must not have any arguments');
      }

      this.logger.debug(`Monitoring custom metric updater ${methodName} registered`);

      this.metricsManager.addCustomMetricUpdater({
        instance,
        methodName
      });
    });
  }

  private exploreDependency({ instance, metatype }: InstanceWrapper) {
    const isDependency = this.reflector.get<boolean | string | undefined>(DEPENDENCY_METADATA_KEY, metatype);
    if (isDependency) {
      if (!instance.isUp) {
        this.logger.error(`Dependency ${metatype.name} is missing isUp() method`);
        throw new Error('Dependency must implement MonitoringDependency interface');
      }
      const name = typeof isDependency === 'string' ? isDependency : metatype.name;

      this.logger.debug(`Monitoring dependency ${name} registered`);
      this.metricsManager.addDependency({
        name,
        instance
      });
    }
  }
}
