import { Log } from '@joinus/server/core';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { UserDeletedEvent, UserCreatedEvent, UserUpdatedPropertyEvent, UserUpdatedEvent } from '../user';
import { UserEvents } from '../user/events/user.events';
import { UserSearchService } from './user-search.service';

@Injectable()
export class UserSearchListener {
  private readonly logger = new Log('UserCreatedListener');

  constructor(
    @Inject(UserSearchService)
    private readonly userSearchService: UserSearchService
  ) {}

  // TODO(Michał): Handle errors!
  @OnEvent(UserEvents.Created)
  async onUserCreated(event: UserCreatedEvent) {
    await this.userSearchService.create(event);

    this.logger.debug(`User ${event.uuid} created in Redis search`);
  }

  // TODO(Michał): Handle errors!
  @OnEvent(UserEvents.Updated)
  async onUserUpdated(event: UserUpdatedEvent) {
    await this.userSearchService.update(event);

    this.logger.debug(`User ${event.uuid} updated in Redis search`);
  }

  // TODO(Michał): Handle errors!
  @OnEvent(UserEvents.UpdatedProperty)
  async onUserUpdatedProperty(event: UserUpdatedPropertyEvent) {
    if (event.property !== 'createdAt' && event.property !== 'uuid' && !(event.value instanceof Date)) {
      await this.userSearchService.updateProperty(event.uuid, event.property, event.value);
    }

    this.logger.debug(`User ${event.uuid} updated in Redis search`);
  }

  // TODO: Handle errors!
  @OnEvent(UserEvents.Deleted)
  async onUserDeleted(event: UserDeletedEvent) {
    await this.userSearchService.delete(event.uuid);

    this.logger.debug(`User ${event.uuid} deleted in Redis search`);
  }
}
