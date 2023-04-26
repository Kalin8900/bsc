import { faker } from '@faker-js/faker';
import { ApiError, AuthEntity } from '@joinus/domain';
import { hashSync } from 'bcrypt';
import { Repository } from 'typeorm';

import { Auth } from '../../src/auth/entities/auth.entity';
import { DataGenerator } from '../integration/util/data-generator';
import { MockFactory } from '../integration/util/mock-factory';

export const authGenerator = new DataGenerator<Auth>(() => ({
  uuid: faker.datatype.uuid(),
  passwordHash: hashSync(faker.internet.password(), 10),
  role: {
    id: 0,
    name: 'user'
  },
  isEmailVerified: faker.datatype.boolean(),
  isPhoneVerified: faker.datatype.boolean(),
  createdAt: faker.date.past(),
  clear: jest.fn(),
}));

export const authRepositoryMock = new MockFactory<Repository<Auth>>()
  .mockAsyncMethod('find', authGenerator.generateMany(5))
  .mockAsyncMethod('findOneOrFail', authGenerator.generate())
  .save();

export const UserErrors = {
  NotFound: 'User not found',
  NotSelf: 'User not self'
} satisfies Record<string, ApiError['name']>