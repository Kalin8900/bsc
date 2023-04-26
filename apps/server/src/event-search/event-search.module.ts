import { RedisOmModule } from '@joinus/server/core';
import { Module } from '@nestjs/common';

import { EventSearchController } from './event-search.controller';
import { EventSearchListener } from './event-search.listener';
import { EventSearchService } from './event-search.service';
import { EventSearchSchema } from './event.search';

@Module({
  imports: [RedisOmModule.forFeature([EventSearchSchema])],
  controllers: [EventSearchController],
  providers: [EventSearchService, EventSearchListener]
})
export class EventSearchModule {}
