import { DynamicModule, Global, Module } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { Client } from 'redis-om';

import { Redis } from '../redis/redis.constants';
import { RedisOMRepositoryRegistry } from './redis-om-repository.registry';

@Global()
@Module({})
export class RedisOmCoreModule {
  public static forRoot(): DynamicModule {
    return {
      module: RedisOmCoreModule,
      providers: [
        {
          provide: Client,
          useFactory: async (redis: RedisClientType) => {
            const client = new Client();

            await client.use(redis);

            return client;
          },
          inject: [Redis]
        },
        RedisOMRepositoryRegistry
      ],
      exports: [Client, RedisOMRepositoryRegistry]
    };
  }
}
