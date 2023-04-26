import { MonitoringConfigService } from '@joinus/server/config';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { collectDefaultMetrics, register } from 'prom-client';

import { Log } from '../../logger/logger';
import { MetricsRegistry } from './metrics.registry';
import { Health, MetricsDependency } from './monitoring-dependency.interface';
import { CustomMetricUpdater } from './monitoring.types';

@Injectable()
export class MetricsManager implements OnModuleDestroy {
  private readonly logger = new Log('MetricsManager');
  public readonly updateInterval: number;
  private interval?: NodeJS.Timeout;
  private readonly dependencies: MetricsDependency[] = [];
  private readonly customMetricsUpdater: CustomMetricUpdater[] = [];

  constructor(
    private readonly metricsRegistry: MetricsRegistry,
    private readonly monitoringConfigService: MonitoringConfigService
  ) {
    this.updateInterval = this.monitoringConfigService.updateInterval;
    this.start().catch((err) => {
      this.logger.error('Error while starting metrics manager', { err });
    });
  }

  private async start() {
    this.logger.info('Starting metrics manager');
    collectDefaultMetrics(this.monitoringConfigService.defaultMetricsCollector);

    this.interval = setInterval(async () => {
      await this.updateMetrics();
    }, this.updateInterval);
  }

  private async updateMetrics() {
    this.metricsRegistry.setHealthStatus(Health.UP);
    await this.updateDependencies();
    await this.updateCustomMetrics();
  }

  private async updateCustomMetrics() {
    await Promise.all(
      this.customMetricsUpdater.map((metric) => {
        this.logger.debug(`Updating custom metric ${metric.methodName}`);

        return metric.instance[metric.methodName]?.();
      })
    );
  }

  private async updateDependencies() {
    for (const dependency of this.dependencies) {
      const isUp = await dependency.instance.isUp();
      this.metricsRegistry.healthDependencyUp.set({ resource: dependency.name }, isUp);
    }
  }

  private async stop() {
    await this.removeDefaultMetrics();

    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  public async onModuleDestroy() {
    this.logger.info('Stopping metrics manager');
    await this.stop();
  }

  private async removeDefaultMetrics() {
    register
      .getMetricsAsArray()
      .filter((metric) => ['process', 'node'].some((name) => metric.name.includes(name)))
      .forEach((metric) => register.removeSingleMetric(metric.name));
  }

  public addDependency(dependency: MetricsDependency) {
    return this.dependencies.push(dependency);
  }

  public addCustomMetricUpdater(updater: CustomMetricUpdater) {
    return this.customMetricsUpdater.push(updater);
  }
}
