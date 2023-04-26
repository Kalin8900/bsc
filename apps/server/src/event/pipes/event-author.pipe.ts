import { EventNotAuthorException, EventNotFoundException } from '@joinus/server/base';
import { ArgumentMetadata, Inject, Injectable, mixin, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import type { RequestWithUser } from '../../auth';
import { EventService } from '../event.service';

export function EventAuthorPipeFactory<T = any>(extractor?: (dto: T) => string) {
  @Injectable()
  class EventAuthorPipeClass implements PipeTransform {
    constructor(
      @Inject(REQUEST)
      readonly request: RequestWithUser,

      private readonly eventService: EventService
    ) {}

    async transform(value: any, _metadata: ArgumentMetadata) {
      try {
        const event = await this.eventService.getOne(extractor ? extractor(value) : value.uuid);
        if (event.author.uuid === this.request.user.uuid) {
          return value;
        }
      } catch (e) {
        throw new EventNotFoundException([`Event ${value.uuid} does not exist`]);
      }

      throw new EventNotAuthorException(['You are not authorized to perform this action']);
    }
  }

  return mixin(EventAuthorPipeClass);
}

export class EventAuthorPipe extends EventAuthorPipeFactory() {}
