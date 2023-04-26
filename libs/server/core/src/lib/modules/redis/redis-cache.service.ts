import { Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';

import { InjectRedis } from './redis.decorators';

@Injectable()
export class RedisCacheService {
  constructor(
    @InjectRedis()
    private readonly redis: RedisClientType
  ) {}

  get(key: string) {
    return this.redis.get(key);
  }

  set<T extends string | number>(key: string, value: T, ttl?: number) {
    return this.redis.set(key, value, {
      EX: ttl
    });
  }
}
