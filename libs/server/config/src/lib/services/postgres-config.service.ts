import { Injectable } from '@nestjs/common';

import { PostgresConfig } from '../configs';
import { ConfigResolverService } from './config-resolver.service';

@Injectable()
export class PostgresConfigService {
  constructor(private readonly configResolver: ConfigResolverService) {}

  get ormConfig() {
    return this.configResolver.resolve<PostgresConfig['ormConfig']>('postgres.ormConfig');
  }
}
