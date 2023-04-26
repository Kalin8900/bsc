import { isPoint, Log } from '@joinus/server/core';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { EventCreatedEvent, EventUpdatedPropertyEvent, EventUpdatedEvent } from '../event';
import { EventEvents } from '../event/events/event.events';
import { EventRecommendationsService } from './event-recommendations.service';

@Injectable()
export class EventRecommendationsListener {
  private readonly logger = new Log('EventRecommendationsListener');

  constructor(private readonly eventRecommendationsService: EventRecommendationsService) {}

  @OnEvent(EventEvents.Created)
  public async onEventCreated(event: EventCreatedEvent) {
    await this.eventRecommendationsService.create(
      {
        uuid: event.uuid,
        lat: event.location.coordinates[1]!,
        long: event.location.coordinates[0]!
      },
      event.author.uuid
    );

    this.logger.debug(`Event ${event.uuid} created in Neo4j`);
  }

  @OnEvent(EventEvents.Updated)
  public async onEventUpdated(event: EventUpdatedEvent) {
    await this.eventRecommendationsService.update({
      uuid: event.uuid,
      lat: event.location.coordinates[1]!,
      long: event.location.coordinates[0]!
    });

    this.logger.debug(`Event ${event.uuid} updated in Neo4j`);
  }

  @OnEvent(EventEvents.UpdatedProperty)
  public async onEventUpdatedProperty(event: EventUpdatedPropertyEvent) {
    if (event.property === 'location' && isPoint(event.value)) {
      await this.eventRecommendationsService.updateProperty(event.uuid, 'lat', event.value.coordinates[1]!);
      await this.eventRecommendationsService.updateProperty(event.uuid, 'long', event.value.coordinates[0]!);
    }

    this.logger.debug(`Event ${event.uuid} updated property ${event.property} in Neo4j`);
  }

  @OnEvent(EventEvents.Deleted)
  public async onEventDeleted(event: EventCreatedEvent) {
    await this.eventRecommendationsService.delete(event.uuid);

    this.logger.debug(`Event ${event.uuid} deleted in Neo4j`);
  }
}
