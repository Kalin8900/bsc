import { Injectable } from '@nestjs/common';
import { RedisClientOptions } from 'redis';

import { ConfigResolverService } from './config-resolver.service';

@Injectable()
export class RedisConfigService {
  constructor(private readonly configResolver: ConfigResolverService) {}

  get redis() {
    return this.configResolver.resolve<RedisClientOptions>('redis');
  }

  get url() {
    return this.configResolver.resolve<RedisClientOptions['url']>('redis.url');
  }
}
