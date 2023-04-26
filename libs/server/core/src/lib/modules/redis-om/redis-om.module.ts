import { DynamicModule, Module, Provider } from '@nestjs/common';
import { Schema } from 'redis-om';

import { RedisOmCoreModule } from './redis-om-core.module';
import { RedisOMRepositoryRegistry } from './redis-om-repository.registry';
import { getSchemaRepositoryToken } from './redis-om.constants';

@Module({})
export class RedisOmModule {
  public static forRoot(): DynamicModule {
    return {
      module: RedisOmModule,
      imports: [RedisOmCoreModule.forRoot()],
      exports: [RedisOmCoreModule]
    };
  }

  public static forFeature(schemas?: Schema<any>[]): DynamicModule {
    const providers = RedisOmModule.createRedisOMProviders(schemas);

    return {
      module: RedisOmModule,
      providers: [...providers],
      exports: [...providers]
    };
  }

  private static createRedisOMProviders(schemas?: Schema<any>[]): Provider[] {
    return (schemas || []).map((schema) => {
      return {
        provide: getSchemaRepositoryToken(schema),
        useFactory: (registry: RedisOMRepositoryRegistry) => {
          return registry.registerRepository(schema);
        },
        inject: [RedisOMRepositoryRegistry]
      };
    });
  }
}
