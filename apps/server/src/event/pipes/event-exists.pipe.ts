import { EventNotFoundException } from '@joinus/server/base';
import { ArgumentMetadata, Injectable, mixin, PipeTransform } from '@nestjs/common';

import { EventService } from '../event.service';

export function EventExistsPipe<T = any>(extractor?: (dto: T) => string) {
  @Injectable()
  class EventExistsPipeClass implements PipeTransform {
    constructor(readonly eventService: EventService) {}

    async transform(value: any, _metadata: ArgumentMetadata) {
      try {
        if (extractor) await this.eventService.getOne(extractor(value));
        else await this.eventService.getOne(value.uuid);
      } catch (e) {
        throw new EventNotFoundException([`Event ${extractor ? extractor(value) : value} does not exist`]);
      }

      return value;
    }
  }

  return mixin(EventExistsPipeClass);
}
