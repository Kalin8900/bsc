import type { DefaultMetricsCollectorConfiguration } from 'prom-client';

export interface MonitoringConfig {
  updateInterval: number;
  defaultMetricsCollector: DefaultMetricsCollectorConfiguration;
  requestDurationBuckets: number[];
  requestDurationSummary: {
    maxAgeSeconds: number;
    ageBuckets: number;
  };
}

export default (): { monitoring: MonitoringConfig } => ({
  monitoring: {
    updateInterval: 5000,
    defaultMetricsCollector: {},
    requestDurationBuckets: [500, 2000],
    requestDurationSummary: {
      maxAgeSeconds: 300,
      ageBuckets: 5
    }
  }
});
