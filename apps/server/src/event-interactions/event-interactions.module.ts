import { Module } from '@nestjs/common';

import { EventInteractionsController } from './event-interactions.controller';
import { EventInteractionsService } from './event-interactions.service';

@Module({
  controllers: [EventInteractionsController],
  providers: [EventInteractionsService],
  exports: [EventInteractionsService]
})
export class EventInteractionsModule {}
