import { Event } from '../entities/event.entity';

export class EventUpdatedEvent extends Event {
  constructor(event: Event) {
    super();
    Object.assign(this, event);
  }
}
