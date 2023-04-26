export enum Health {
  UP = 1,
  DOWN = 0
}

export interface MonitoringDependency {
  isUp(): Health | Promise<Health>;
}

export interface MetricsDependency {
  name: string;
  instance: MonitoringDependency;
}
