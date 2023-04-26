import { MonitoringConfigService } from '@joinus/server/config';
import { Injectable } from '@nestjs/common';
import { register, Gauge, Counter, Summary, Histogram } from 'prom-client';

import { Health } from './monitoring-dependency.interface';
import { Status } from './monitoring.types';

@Injectable()
export class MetricsRegistry {
  public healthServiceUp: Gauge;
  public healthDependencyUp: Gauge;
  public requestCount: Counter;
  public requestDuration: Summary;
  public requestDurationBuckets: Histogram;

  constructor(private readonly monitoringConfigService: MonitoringConfigService) {
    register.removeSingleMetric('health_service_up');
    register.removeSingleMetric('health_dependency_up');
    register.removeSingleMetric('request_count');
    register.removeSingleMetric('request_duration_milliseconds');
    register.removeSingleMetric('request_duration_buckets_milliseconds');

    this.healthServiceUp = new Gauge({
      name: 'health_service_up',
      help: 'Health of the service node',
      labelNames: ['service']
    });

    this.healthDependencyUp = new Gauge({
      name: 'health_dependency_up',
      help: 'Health of the service dependencies',
      labelNames: ['dependency', 'resource']
    });

    this.requestCount = new Counter({
      name: 'request_count',
      help: 'Number of requests',
      labelNames: ['service', 'method', 'path', 'status']
    });

    this.requestDuration = new Summary({
      name: 'request_duration_milliseconds',
      help: 'Duration of requests in milliseconds',
      labelNames: ['service', 'method', 'path', 'status'],
      maxAgeSeconds: this.monitoringConfigService.requestDurationSummaryMaxAgeSeconds,
      ageBuckets: this.monitoringConfigService.requestDurationSummaryAgeBuckets
    });

    this.requestDurationBuckets = new Histogram({
      name: 'request_duration_buckets_milliseconds',
      help: 'Duration of requests in milliseconds',
      labelNames: ['service', 'method', 'path', 'status'],
      buckets: this.monitoringConfigService.requestDurationBuckets
    });
  }

  public metrics() {
    return register.metrics();
  }

  public serviceHealth(): Status {
    // TODO: Create some typing for this
    const values = Object.values((this.healthServiceUp as any).hashMap);

    return values.length > 0 && values.every((value: any) => value.value === 1) ? 'UP' : 'DOWN';
  }

  public dependenciesHealth(): Record<string, Status> {
    const values: any[] = Object.values((this.healthDependencyUp as any).hashMap);

    return values.reduce((acc, value) => {
      acc[value.labels.resource] = value.value === 1 ? 'UP' : 'DOWN';

      return acc;
    }, {} as Record<string, Status>);
  }

  public setHealthStatus(health: Health) {
    return this.healthServiceUp.set(health === Health.UP ? 1 : 0);
  }
}
