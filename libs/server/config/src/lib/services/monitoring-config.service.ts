import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MonitoringConfig } from '../configs/monitoring.config';
import { ConfigResolverService } from './config-resolver.service';

@Injectable()
export class MonitoringConfigService {
  constructor(private readonly configResolverService: ConfigResolverService) {}

  get updateInterval() {
    return this.configResolverService.resolve<MonitoringConfig['updateInterval']>('monitoring.updateInterval');
  }

  get defaultMetricsCollector() {
    return this.configResolverService.resolve<MonitoringConfig['defaultMetricsCollector']>(
      'monitoring.defaultMetricsCollector'
    );
  }

  get requestDurationBuckets() {
    return this.configResolverService.resolve<MonitoringConfig['requestDurationBuckets']>(
      'monitoring.requestDurationBuckets'
    );
  }

  get requestDurationSummary() {
    return this.configResolverService.resolve<MonitoringConfig['requestDurationSummary']>(
      'monitoring.requestDurationSummary'
    );
  }

  get requestDurationSummaryMaxAgeSeconds() {
    return this.configResolverService.resolve<MonitoringConfig['requestDurationSummary']['maxAgeSeconds']>(
      'monitoring.requestDurationSummary.maxAgeSeconds'
    );
  }

  get requestDurationSummaryAgeBuckets() {
    return this.configResolverService.resolve<MonitoringConfig['requestDurationSummary']['ageBuckets']>(
      'monitoring.requestDurationSummary.ageBuckets'
    );
  }
}
