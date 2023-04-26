import { Inject } from '@nestjs/common';

import { Redis, RedisConfig } from './redis.constants';

export const InjectRedis = () => Inject(Redis);

export const InjectRedisOptions = () => Inject(RedisConfig);
