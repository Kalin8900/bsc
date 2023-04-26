export const RedisConfig = Symbol('RedisConfig');
export const Redis = Symbol('Redis');

export const cacheKey = (...args: (string | number | Date)[]): string => args.join(':');
