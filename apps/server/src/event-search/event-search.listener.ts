import { Log } from '@joinus/server/core';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EventCreatedEvent, EventDeletedEvent, EventUpdatedPropertyEvent, EventUpdatedEvent } from '../event';
import { EventEvents } from '../event/events/event.events';
import { EventSearchService } from './event-search.service';

@Injectable()
export class EventSearchListener {
  private readonly logger = new Log('EventSearchListener');

  constructor(private readonly eventSearchService: EventSearchService) {}

  // TODO(Michał): Handle errors!
  @OnEvent(EventEvents.Created)
  public async onEventCreated(event: EventCreatedEvent) {
    await this.eventSearchService.create({
      ...event,
      description: event.description || ''
    });

    this.logger.debug(`Event ${event.uuid} created in Redis search`);
  }

  // TODO(Michał): Handle errors!
  @OnEvent(EventEvents.Updated)
  public async onEventUpdated(event: EventUpdatedEvent) {
    await this.eventSearchService.update({
      ...event,
      description: event.description || ''
    });

    this.logger.debug(`Event ${event.uuid} updated in Redis search`);
  }

  // TODO(Michał): Handle errors!
  @OnEvent(EventEvents.UpdatedProperty)
  public async onEventUpdatedProperty(event: EventUpdatedPropertyEvent) {
    if ((event.property === 'name' || event.property === 'description') && typeof event.value === 'string') {
      await this.eventSearchService.updateProperty(event.uuid, event.property, event.value);

      this.logger.debug(`Event ${event.uuid} updated in Redis search`);
    }
  }

  // TODO(Michał): Handle errors!
  @OnEvent(EventEvents.Deleted)
  public async onEventDeleted(event: EventDeletedEvent) {
    await this.eventSearchService.delete(event.uuid);

    this.logger.debug(`Event ${event.uuid} deleted in Redis search`);
  }
}
