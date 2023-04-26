import { AppConfigService } from '@joinus/server/config';
import { Injectable } from '@nestjs/common';

import { MetricsRegistry } from './metrics.registry';
import { Status } from './monitoring.types';

@Injectable()
export class MonitoringService {
  constructor(private readonly appConfigService: AppConfigService, private readonly metricsRegistry: MetricsRegistry) {}

  public getMetrics() {
    return this.metricsRegistry.metrics();
  }

  public getHealth(): Record<string, Status | Record<string, Status>> {
    return {
      health: this.metricsRegistry.serviceHealth(),
      resources: this.metricsRegistry.dependenciesHealth()
    };
  }

  public getInfo() {
    return {
      name: this.appConfigService.name,
      version: this.appConfigService.version
    };
  }

  public incrementRequestCount(path: string, method: string) {
    this.metricsRegistry.requestCount.inc({ path, method });
  }

  public observeRequestDuration(path: string, method: string, status: string, duration: number) {
    this.metricsRegistry.requestDuration.observe({ path, method, status }, duration);
    this.metricsRegistry.requestDurationBuckets.observe({ path, method, status }, duration);
  }
}
