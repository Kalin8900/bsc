import { faker } from '@faker-js/faker';
import { ApiError } from '@joinus/domain';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { Event } from '../../src/event/entities/event.entity';
import { DataGenerator } from '../integration/util/data-generator';
import { MockFactory } from '../integration/util/mock-factory';
import { userGenerator } from './user';

export const eventGenerator = new DataGenerator<Event>(() => ({
  uuid: faker.datatype.uuid(),
  name: faker.word.verb(),
  description: faker.lorem.paragraph(),
  createdAt: faker.date.past(),
  startDate: faker.date.future(),
  author: userGenerator.generate(),
  location: {
    type: 'Point',
    coordinates: [Number(faker.address.longitude()), Number(faker.address.latitude())]
  }
}));

export const eventRepositoryMock = new MockFactory<Repository<Event>>()
  .mockAsyncMethod('find', eventGenerator.generateMany(10))
  .mockAsyncMethod('findOneOrFail', eventGenerator.generate())
  .mockAsyncMethod('save', eventGenerator.generate())
  .mockAsyncMethod('update', { affected: 1 } as UpdateResult)
  .mockAsyncMethod('delete', { affected: 1 } as DeleteResult)
  .save();

export const EventErrors = {
  NotFound: 'Event not found',
  NotAuthor: 'Event not author'
} satisfies Record<string, ApiError['message']>