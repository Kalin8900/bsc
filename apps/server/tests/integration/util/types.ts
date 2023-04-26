export type NonFunctionProperties<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K;
}[keyof T];

export type SyncMethods<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer U ? (U extends Promise<any> ? never : K) : never;
}[keyof T];

export type AsyncMethods<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => Promise<any> ? K : never;
}[keyof T];

export type EnsuredReturnType<T, K extends keyof T> = T[K] extends (...args: any[]) => any ? ReturnType<T[K]> : never;

export type AwaitedMethodValueMap<T> = {
  [K in keyof T]?: Awaited<EnsuredReturnType<T, K>>;
};
