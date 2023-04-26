import appConfig from './lib/configs/app.config';
import authConfig from './lib/configs/auth.config';
import eventInteractionsConfig from './lib/configs/event-interactions.config';
import httpClientConfig from './lib/configs/http-client.config';
import mapboxConfig from './lib/configs/mapbox.config';
import monitoringConfig from './lib/configs/monitoring.config';
import neo4jConfig from './lib/configs/neo4j.config';
import postgresConfig from './lib/configs/postgres.config';
import redisConfig from './lib/configs/redis.config';
import swaggerConfig from './lib/configs/swagger.config';
import {
  AuthConfigService,
  ConfigResolverService,
  EventInteractionsConfigService,
  FacadesConfigService,
  Neo4jConfigService,
  PostgresConfigService,
  RedisConfigService
} from './lib/services';
import { AppConfigService } from './lib/services/app-config.service';
import { HttpClientConfigService } from './lib/services/http-client-config.service';
import { MonitoringConfigService } from './lib/services/monitoring-config.service';
import { SwaggerConfigService } from './lib/services/swagger-config.service';

export * from './lib/configs';
export * from './lib/services';

export const configs = [
  appConfig,
  httpClientConfig,
  monitoringConfig,
  swaggerConfig,
  postgresConfig,
  redisConfig,
  neo4jConfig,
  eventInteractionsConfig,
  mapboxConfig,
  authConfig
];

export const services = [
  ConfigResolverService,
  AppConfigService,
  HttpClientConfigService,
  SwaggerConfigService,
  MonitoringConfigService,
  PostgresConfigService,
  RedisConfigService,
  Neo4jConfigService,
  EventInteractionsConfigService,
  FacadesConfigService,
  AuthConfigService
];
