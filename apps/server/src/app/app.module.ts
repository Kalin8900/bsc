import { PostgresConfigService } from '@joinus/server/config';
import { CoreModule } from '@joinus/server/core';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { Auth } from '../auth/entities/auth.entity';
import { CategorizationModule } from '../categorization/categorization.module';
import { CategoryModule } from '../category/category.module';
import { Category } from '../category/entities/category.entity';
import { EventInteractionsModule } from '../event-interactions';
import { EventRecommendationsModule } from '../event-recommendations';
import { EventSearchModule } from '../event-search';
import { Event } from '../event/entities/event.entity';
import { EventModule } from '../event/event.module';
import { FakeModule } from '../fake/fake.module';
import { FriendsModule } from '../friends/friends.module';
import { MapboxModule } from '../mapbox/mapbox.module';
import { MonitoringModule } from '../monitoring/monitoring.module';
import { Role, RoleModule } from '../role';
import { TaggingModule } from '../tagging/tagging.module';
import { User, UserModule } from '../user';
import { UserRecommendationsModule } from '../user-recommendations';
import { UserSearchModule } from '../user-search';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [PostgresConfigService],
      useFactory: (configService: PostgresConfigService) => ({
        ...configService.ormConfig,
        entities: [Auth, User, Role, Event, Category]
      })
    }),
    CoreModule,
    MonitoringModule,
    AuthModule,
    UserModule,
    UserSearchModule,
    UserRecommendationsModule,
    RoleModule,
    FriendsModule,
    EventModule,
    EventSearchModule,
    EventRecommendationsModule,
    EventInteractionsModule,
    CategoryModule,
    CategorizationModule,
    TaggingModule,
    MapboxModule,
    FakeModule
  ]
})
export class AppModule {}
