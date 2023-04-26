import { Event } from '../entities/event.entity';

export class EventCreatedEvent extends Event {
  constructor(event: Event) {
    super();
    Object.assign(this, event);
  }
}
