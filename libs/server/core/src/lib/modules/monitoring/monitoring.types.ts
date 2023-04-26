export type Status = 'UP' | 'DOWN';

export interface CustomMetricUpdater {
  methodName: string;
  instance: Record<string, (...args: unknown[]) => Promise<void>>;
}

export interface StatusData {
  health: Status;
  resources: Record<string, Status>;
}
