import { DynamicModule, Global, Module, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { createClient, RedisClientOptions, RedisClientType } from 'redis';

import { Log } from '../../logger/logger';
import { RedisCacheService } from './redis-cache.service';
import { Redis, RedisConfig } from './redis.constants';
import { IRedisModuleOptions } from './redis.types';

@Global()
@Module({})
export class RedisModule implements OnApplicationShutdown {
  private readonly logger = new Log('RedisModule');

  constructor(private readonly moduleRef: ModuleRef) {}

  public static forRootAsync(options: IRedisModuleOptions): DynamicModule {
    const client = this.createClientProvider();

    return {
      module: RedisModule,
      providers: [
        {
          provide: RedisConfig,
          useFactory: options.useFactory,
          inject: options.inject || []
        },
        client,
        RedisCacheService
      ],
      exports: [Redis, RedisConfig, RedisCacheService]
    };
  }

  async onApplicationShutdown() {
    const client = this.moduleRef.get<RedisClientType>(Redis);

    this.logger.info(`Closing RedisClient`);

    await client.quit();
  }

  private static createClientProvider() {
    return {
      provide: Redis,
      useFactory: async (config: RedisClientOptions) => {
        const redis = createClient(config);

        await redis.connect();

        Log.info('Redis connection established', { url: config.url }, 'RedisModule');

        return redis;
      },
      inject: [RedisConfig]
    };
  }
}
