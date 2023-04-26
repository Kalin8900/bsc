import { Injectable } from '@nestjs/common';

import { Neo4jConfig } from '../configs/neo4j.config';
import { ConfigResolverService } from './config-resolver.service';

@Injectable()
export class Neo4jConfigService {
  constructor(private readonly configResolverService: ConfigResolverService) {}

  get uri() {
    return this.configResolverService.resolve<Neo4jConfig['url']>('neo4j.url');
  }

  get credentials() {
    return this.configResolverService.resolve<Neo4jConfig['auth']>('neo4j.auth');
  }

  get neo4j() {
    return this.configResolverService.resolve<Neo4jConfig>('neo4j');
  }
}
