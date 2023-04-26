import { faker } from '@faker-js/faker';
import { CategoryEntity, UserEntity } from '@joinus/domain';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { isFuture, sub } from 'date-fns';

import { CategoryService } from '../category';
import { EventService } from '../event';
import { EventInteractionsService } from '../event-interactions';
import { FriendsService } from '../friends';
import { UserService } from '../user';

// This code is only for testing purposes. It's messy and not optimized.
// It's not a part of the application and it doesn't have tests.

@Injectable()
export class FakeService implements OnModuleInit {
  private readonly strategies = ['like', 'dislike', 'interest', 'attend', 'superlike'] as const;

  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    private readonly eventInteractionService: EventInteractionsService,
    private readonly friendsService: FriendsService
  ) {}

  async onModuleInit() {
    const categoriesCount = (await this.categoryService.getAll()).reduce((acc) => acc + 1, 0);

    if (categoriesCount === 0) {
      await this.category(20);
      Logger.log('Categories generated', 'FakeService');
    }

    Logger.log(`Loaded categories - ${categoriesCount}`, 'FakeService');
  }

  public async user(count: number) {
    const promises: Promise<any>[] = [];

    for (let i = 0; i < count; i++) {
      promises.push(this.generateUser());
    }

    return Promise.all(promises);
  }

  private async generateUser(): Promise<UserEntity> {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const user = await this.userService.create({
      firstName,
      lastName,
      email: faker.internet.email(firstName, lastName),
      phone: faker.phone.number(`+48${faker.random.numeric(9, { bannedDigits: ['0'] })}`)
    });

    for (let i = 0; i < faker.datatype.number({ min: 0, max: 10 }); i++) {
      await this.eventService.create(
        {
          name: `${faker.commerce.productAdjective()} ${faker.commerce.productName()}`,
          description: faker.lorem.paragraph(),
          location: {
            type: 'Point',
            coordinates: [Number(faker.address.longitude(54.5, 54.4)), Number(faker.address.latitude(24, 23.9))]
          },
          startDate: faker.date.soon(90)
        },
        user.uuid
      );
      await this.eventService.create(
        {
          name: `${faker.commerce.productAdjective()} ${faker.commerce.productName()}`,
          description: faker.lorem.paragraph(),
          location: {
            type: 'Point',
            coordinates: [Number(faker.address.longitude(54.5, 49.5)), Number(faker.address.latitude(24, 14))]
          },
          startDate: sub(new Date(), { days: faker.datatype.number({ min: 1, max: 90 }) })
        },
        user.uuid
      );
    }

    return user;
  }

  public async category(count: number): Promise<CategoryEntity[]> {
    const promises: Promise<any>[] = [];

    for (let i = 0; i < count; i++) {
      promises.push(
        this.categoryService.create({
          name: `${faker.commerce.productAdjective()} ${faker.commerce.productName()}`,
          description: faker.lorem.paragraph(),
          imageUrl: faker.image.imageUrl()
        })
      );
    }

    return Promise.all(promises);
  }

  public async friends() {
    const users = (await this.userService.getAll()).map((user) => user.uuid);
    const promises: Promise<any>[] = [];

    for (const user of users) {
      const friends = faker.helpers
        .arrayElements(users, faker.datatype.number({ min: 0, max: 10 }))
        .filter((friend) => friend !== user);
      for (const friend of friends) {
        promises.push(this.friendsService.createFriend(user, friend));
      }
    }

    return Promise.all(promises);
  }

  public async interactions() {
    const users = (await this.userService.getAll()).map((user) => user.uuid);
    const { future, past } = (await this.eventService.getAll()).reduce(
      (acc, event) => {
        if (event.startDate && isFuture(event.startDate)) {
          acc.future.push(event.uuid);
        } else acc.past.push(event.uuid);

        return acc;
      },
      { future: [], past: [] } as { future: string[]; past: string[] }
    );
    const promises: Promise<any>[] = [];

    for (const user of users) {
      const futureToInteract = faker.helpers.arrayElements(future, faker.datatype.number({ min: 0, max: 6 }));
      for (const event of futureToInteract) {
        const strategy = faker.helpers.arrayElement(this.strategies);
        promises.push(this.eventInteractionService.strategy(strategy).do(user, event));
      }
      const pastToInteract = faker.helpers.arrayElements(past, faker.datatype.number({ min: 0, max: 6 }));
      for (const event of pastToInteract) {
        const strategy = faker.helpers.arrayElement(this.strategies);
        promises.push(this.eventInteractionService.strategy(strategy).do(user, event));

        if (strategy !== 'dislike') {
          promises.push(
            this.eventInteractionService
              .strategy('rate')
              .do(user, event, { relation: { rating: faker.datatype.number({ min: 1, max: 5 }) } })
          );
        }
      }
    }

    return Promise.all(promises);
  }
}
