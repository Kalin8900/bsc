import { configs, services } from '@joinus/server/config';
import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: configs
    })
  ],
  providers: services,
  exports: services
})
export class ConfigModule {}
