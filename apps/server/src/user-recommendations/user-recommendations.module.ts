import { Module } from '@nestjs/common';

import { UserRecommendationsController } from './user-recommendations.controller';
import { UserRecommendationsListener } from './user-recommendations.listener';
import { UserRecommendationsService } from './user-recommendations.service';

@Module({
  controllers: [UserRecommendationsController],
  providers: [UserRecommendationsService, UserRecommendationsListener],
  exports: [UserRecommendationsService]
})
export class UserRecommendationsModule {}
