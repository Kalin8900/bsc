import {
  httpClientConfigFactory,
  HttpClientConfigService,
  Neo4jConfigService,
  RedisConfigService
} from '@joinus/server/config';
import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import {
  GlobalEntityNotFoundErrorFilter,
  HttpExceptionFilter,
  NotFoundExceptionFilter,
  UnauthorizedExceptionFilter
} from './filters';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { BasicAuthModule } from './modules/basic-auth/basic-auth.module';
import { ConfigModule } from './modules/config/config.module';
import { HttpClientModule } from './modules/http-client/http-client.module';
import { HttpFacadeModule } from './modules/http-facade/http-facade.module';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { Neo4jModule } from './modules/neo4j';
import { RedisModule } from './modules/redis';
import { RedisOmModule } from './modules/redis-om';
import { ValidationModule } from './modules/validation/validation.module';
import { GlobalValidationPipe } from './pipes/global-validation.pipe';

@Global()
@Module({
  imports: [
    ConfigModule,
    HttpClientModule.forRootAsync({
      inject: [HttpClientConfigService],
      useFactory: httpClientConfigFactory
    }),
    RedisModule.forRootAsync({
      inject: [RedisConfigService],
      useFactory: (redisConfigService: RedisConfigService) => redisConfigService.redis
    }),
    RedisOmModule.forRoot(),
    Neo4jModule.forRootAsync({
      inject: [Neo4jConfigService],
      useFactory: (neo4jConfigService: Neo4jConfigService) => neo4jConfigService.neo4j
    }),
    BasicAuthModule,
    MonitoringModule,
    ValidationModule,
    HttpFacadeModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter
    },
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter
    },
    {
      provide: APP_FILTER,
      useClass: GlobalEntityNotFoundErrorFilter
    },
    {
      provide: APP_PIPE,
      useClass: GlobalValidationPipe
    }
  ]
})
export class CoreModule {}
