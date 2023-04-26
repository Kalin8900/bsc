import { faker } from '@faker-js/faker';
import { Log } from '@joinus/server/core';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { CategorizationService } from '../categorization';
import { Category, CategoryService } from '../category';
import { EventCreatedEvent, EventEvents } from '../event';
import { TaggingService } from '../tagging';

@Injectable()
export class FakeListener {
  private categories: Category[] = [];

  constructor(
    private readonly categoryService: CategoryService,
    private readonly categorizationService: CategorizationService,
    private readonly taggingService: TaggingService
  ) {
    this.init().catch(console.error);
  }

  private async init() {
    this.categories = await this.categoryService.getAll();
  }

  @OnEvent(EventEvents.Created)
  async onEventCreated(event: EventCreatedEvent) {
    setTimeout(async () => {
      const categories = faker.helpers.arrayElements(this.categories, 3);
      for (const cat of categories) {
        await this.categorizationService.setCategory(event.uuid, cat.uuid).catch(console.error);
        Log.debug(`Event ${event.uuid} categorized with ${cat.uuid}`);
      }
    }, 1000);

    faker.helpers.arrayElements([1, 2, 3, 4, 5]).forEach(async () => {
      setTimeout(async () => {
        await this.taggingService.tag(event.uuid, { name: faker.word.adjective(5) }).catch(console.error);
      }, 300);
    });
  }
}
