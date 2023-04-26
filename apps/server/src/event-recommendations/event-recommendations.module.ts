import { Module } from '@nestjs/common';

import { EventRecommendationsController } from './event-recommendations.controller';
import { EventRecommendationsListener } from './event-recommendations.listener';
import { EventRecommendationsService } from './event-recommendations.service';

@Module({
  controllers: [EventRecommendationsController],
  providers: [EventRecommendationsService, EventRecommendationsListener]
})
export class EventRecommendationsModule {}
