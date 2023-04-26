import { faker } from '@faker-js/faker';
import { ApiError } from '@joinus/domain';
import { Repository } from 'typeorm';

import { User } from '../../src/user';
import { DataGenerator } from '../integration/util/data-generator';
import { MockFactory } from '../integration/util/mock-factory';

export const userGenerator = new DataGenerator<User>(() => ({
  uuid: faker.datatype.uuid(),
  email: faker.internet.email().toLowerCase(),
  phone: faker.phone.number('+485########'),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  createdAt: faker.date.past()
}));

export const userRepositoryMock = new MockFactory<Repository<User>>()
  .mockAsyncMethod('find', userGenerator.generateMany(5))
  .mockAsyncMethod('findOneOrFail', userGenerator.generate())
  .mockAsyncMethod('save', userGenerator.generate())
  .save();

export const UserErrors = {
  NotFound: 'User not found',
  NotSelf: 'User not self'
} satisfies Record<string, ApiError['message']>