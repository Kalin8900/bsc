import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface PostgresConfig {
  ormConfig: Partial<TypeOrmModuleOptions>;
}

export default (): { postgres: PostgresConfig } => ({
  postgres: {
    ormConfig: {
      type: 'postgres',
      host: process.env.POSTGIS_HOST ?? 'localhost',
      port: parseInt(process.env.POSTGIS_PORT ?? '5432', 10),
      username: process.env.POSTGIS_USER ?? 'postgres',
      password: process.env.POSTGIS_PASSWORD ?? 'postgres',
      schema: process.env.DEV ? 'dev' : 'production',
      database: process.env.POSTGIS_DB ?? 'joinus',
      synchronize: false
    }
  }
});
