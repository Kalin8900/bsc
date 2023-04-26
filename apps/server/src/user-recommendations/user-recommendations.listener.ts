import { Log } from '@joinus/server/core';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { UserCreatedEvent } from '../user';
import { UserEvents } from '../user/events/user.events';
import { UserRecommendationsService } from './user-recommendations.service';

@Injectable()
export class UserRecommendationsListener {
  private readonly logger = new Log('UserRecommendationsListener');

  constructor(private readonly userRecommendationsService: UserRecommendationsService) {}

  // TODO: Handle errors
  @OnEvent(UserEvents.Created)
  public async onUserCreated(user: UserCreatedEvent) {
    await this.userRecommendationsService.create({
      uuid: user.uuid
    });

    this.logger.debug(`User ${user.uuid} created in Neo4j`);
  }

  // TODO: Handle errors
  @OnEvent(UserEvents.Deleted)
  public async onUserDeleted(user: UserCreatedEvent) {
    await this.userRecommendationsService.delete(user.uuid);

    this.logger.debug(`User ${user.uuid} deleted in Neo4j`);
  }
}
