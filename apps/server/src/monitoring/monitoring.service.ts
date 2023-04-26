import { MetricUpdater } from '@joinus/server/core';
import { Injectable } from '@nestjs/common';
import { Gauge } from 'prom-client';

@Injectable()
export class MonitoringService {
  private readonly testMetric = new Gauge({
    name: 'test_metric',
    help: 'Test metric'
  });

  @MetricUpdater()
  public updateTestMetric() {
    this.testMetric.inc(1);
  }
}
