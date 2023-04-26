import { Neo4jConfig } from '@joinus/server/config';
import { DynamicModule, Global, Module, OnApplicationShutdown, Provider } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Connection } from 'cypher-query-builder';

import { Log } from '../../logger/logger';
import { Neo4jConfig as Neo4jConfigToken, Neo4jQueryBuilder } from './neo4j.constants';
import { Neo4jModuleOptions } from './neo4j.types';

@Global()
@Module({})
export class Neo4jModule implements OnApplicationShutdown {
  private readonly logger = new Log('Neo4jModule');

  constructor(private readonly moduleRef: ModuleRef) {}

  public static forRootAsync(options: Neo4jModuleOptions): DynamicModule {
    const queryBuilder = this.createQueryBuilder();

    return {
      module: Neo4jModule,
      imports: [],
      providers: [
        {
          provide: Neo4jConfigToken,
          useFactory: options.useFactory,
          inject: options.inject || []
        },
        queryBuilder
      ],
      exports: [queryBuilder]
    };
  }

  async onApplicationShutdown() {
    const connection = this.moduleRef.get<Connection>(Neo4jQueryBuilder);

    this.logger.info('Closing Neo4j connection...');

    await connection.close();
  }

  private static createQueryBuilder(): Provider<Connection> {
    return {
      provide: Neo4jQueryBuilder,
      useFactory: (config: Neo4jConfig) => {
        const connection = new Connection(config.url, config.auth, config.options);

        Log.info('Neo4j connection established', { url: config.url }, 'Neo4jModule');

        return connection;
      },
      inject: [Neo4jConfigToken]
    };
  }
}
