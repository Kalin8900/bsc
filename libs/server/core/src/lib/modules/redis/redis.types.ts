import { ModuleMetadata } from '@nestjs/common';
import { RedisClientOptions } from 'redis';

export interface IRedisModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory: (...args: any[]) => Promise<RedisClientOptions> | RedisClientOptions;
}
