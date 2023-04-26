import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SuperAgentTest } from 'supertest';
import { EntityNotFoundError, UpdateResult } from 'typeorm';

import { Auth } from '../../src/auth/entities/auth.entity';
import { User, UserModule } from '../../src/user';
import { UserErrors, userRepositoryMock } from '../factories/user';
import { Errors } from './util/errors';
import { TestApp } from './util/test-app';

describe('UserModule integration tests', () => {
  let testApp: TestApp;
  let supertestWithToken: SuperAgentTest;

  beforeAll(async () => {
    testApp = await TestApp.create(
      {
        imports: [UserModule]
      },
      [
        {
          typeOrToken: getRepositoryToken(Auth),
          value: {}
        },
        {
          typeOrToken: getRepositoryToken(User),
          value: userRepositoryMock.mock
        }
      ]
    );

    supertestWithToken = await testApp.supertestWithUser('test');
  });

  afterAll(async () => {
    await testApp.close();
  });

  beforeEach(() => {
    userRepositoryMock.restore();
  });

  it('should be defined', () => {
    expect(testApp.app).toBeDefined();
  });

  describe('GET /users', () => {
    it('should return 200', async () => {
      const response = await supertestWithToken.get('/users');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        userRepositoryMock
          .getMockedMethodValue('find')
          ?.map((user) => ({ ...user, createdAt: user.createdAt.toISOString() }))
      );
    });

    it('should return 401 when token is missing', async () => {
      const response = await testApp.supertest.get('/users');

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 401 when token is invalid', async () => {
      const response = await testApp.supertest.get('/users').set('Authorization', 'Bearer invalid');

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });
  });

  describe('GET /users/:uuid', () => {
    it('should return 200', async () => {
      const user = userRepositoryMock.getMockedMethodValue('findOneOrFail');

      const response = await supertestWithToken.get(`/users/${user?.uuid}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ ...user, createdAt: user?.createdAt.toISOString() });
    });

    it('should return 401 when token is missing', async () => {
      const response = await testApp.supertest.get('/users/56a3ee4c-29c2-496b-8c42-37b0af2c71ef');

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 401 when token is invalid', async () => {
      const response = await testApp.supertest
        .get('/users/56a3ee4c-29c2-496b-8c42-37b0af2c71ef')
        .set('Authorization', 'Bearer invalid');

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 404 when user is not found', async () => {
      userRepositoryMock.mockRejectAsyncMethod('findOneOrFail', new EntityNotFoundError(User, '56a'));

      const response = await supertestWithToken.get('/users/56a3ee4c-29c2-496b-8c42-37b0af2c71ef');

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toEqual(UserErrors.NotFound);
    });
  });

  describe('PUT /users/:uuid', () => {
    it('should return 200', async () => {
      const user = userRepositoryMock.getMockedMethodValue('findOneOrFail');
      userRepositoryMock.mockAsyncMethod('save', { ...user, firstName: 'John' } as User);

      const response = await supertestWithToken.put(`/users/${user?.uuid}`).send({ ...user, firstName: 'John' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ ...user, firstName: 'John', createdAt: user?.createdAt.toISOString() });
    });

    it('should return 401 when token is missing', async () => {
      const response = await testApp.supertest.put('/users/56a3ee4c-29c2-496b-8c42-37b0af2c71ef');

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 401 when token is invalid', async () => {
      const response = await testApp.supertest
        .put('/users/56a3ee4c-29c2-496b-8c42-37b0af2c71ef')
        .set('Authorization', 'Bearer invalid');

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 403 when user is not the same as the one in the token', async () => {
      const user = userRepositoryMock.getMockedMethodValue('findOneOrFail');

      const response = await supertestWithToken
        .put('/users/56a3ee4c-29c2-496b-8c42-37b0af2c71ef')
        .send({ ...user, firstName: 'John', uuid: faker.datatype.uuid() });

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toEqual(UserErrors.NotSelf);
    });
  });

  describe('PATCH /users/:uuid/email', () => {
    it('should return 200', async () => {
      const user = userRepositoryMock.getMockedMethodValue('findOneOrFail');
      userRepositoryMock.mockAsyncMethod('update', { affected: 1 } as UpdateResult);

      const response = await supertestWithToken
        .patch(`/users/${user?.uuid}/email`)
        .send({ email: faker.internet.email() });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ affected: 1 });
    });

    it('should return 401 when token is missing', async () => {
      const response = await testApp.supertest.patch('/users/56a3ee4c-29c2-496b-8c42-37b0af2c71ef/email');

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 401 when token is invalid', async () => {
      const response = await testApp.supertest
        .patch('/users/56a3ee4c-29c2-496b-8c42-37b0af2c71ef/email')
        .set('Authorization', 'Bearer invalid');

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 403 when user is not the same as the one in the token', async () => {
      userRepositoryMock.getMockedMethodValue('findOneOrFail');

      const response = await supertestWithToken
        .patch('/users/56a3ee4c-29c2-496b-8c42-37b0af2c71ef/email')
        .send({ email: faker.internet.email() });

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toEqual(UserErrors.NotSelf);
    });
  });

  describe('PATCH /users/:uuid/phone', () => {
    it('should return 200', async () => {
      const user = userRepositoryMock.getMockedMethodValue('findOneOrFail');
      userRepositoryMock.mockAsyncMethod('update', { affected: 1 } as UpdateResult);

      const response = await supertestWithToken
        .patch(`/users/${user?.uuid}/phone`)
        .send({ phone: faker.phone.number('+485########') });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ affected: 1 });
    });

    it('should return 401 when token is missing', async () => {
      const response = await testApp.supertest.patch('/users/56a3ee4c-29c2-496b-8c42-37b0af2c71ef/phone');

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 401 when token is invalid', async () => {
      const response = await testApp.supertest
        .patch('/users/56a3ee4c-29c2-496b-8c42-37b0af2c71ef/phone')
        .set('Authorization', 'Bearer invalid');

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 403 when user is not the same as the one in the token', async () => {
      userRepositoryMock.getMockedMethodValue('findOneOrFail');

      const response = await supertestWithToken
        .patch('/users/56a3ee4c-29c2-496b-8c42-37b0af2c71ef/phone')
        .send({ phone: faker.phone.number('+485########') });

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toEqual(UserErrors.NotSelf);
    });
  });

  describe('PATCH /users/:uuid/first-name', () => {
    it('should return 200', async () => {
      const user = userRepositoryMock.getMockedMethodValue('findOneOrFail');
      userRepositoryMock.mockAsyncMethod('update', { affected: 1 } as UpdateResult);

      const response = await supertestWithToken
        .patch(`/users/${user?.uuid}/first-name`)
        .send({ firstName: faker.name.firstName() });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ affected: 1 });
    });

    it('should return 401 when token is missing', async () => {
      const response = await testApp.supertest.patch('/users/56a3ee4c-29c2-496b-8c42-37b0af2c71ef/first-name');

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 401 when token is invalid', async () => {
      const response = await testApp.supertest
        .patch('/users/56a3ee4c-29c2-496b-8c42-37b0af2c71ef/first-name')
        .set('Authorization', 'Bearer invalid');

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 403 when user is not the same as the one in the token', async () => {
      userRepositoryMock.getMockedMethodValue('findOneOrFail');

      const response = await supertestWithToken
        .patch('/users/56a3ee4c-29c2-496b-8c42-37b0af2c71ef/first-name')
        .send({ firstName: faker.name.firstName() });

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toEqual(UserErrors.NotSelf);
    });
  });

  describe('PATCH /users/:uuid/last-name', () => {
    it('should return 200', async () => {
      const user = userRepositoryMock.getMockedMethodValue('findOneOrFail');
      userRepositoryMock.mockAsyncMethod('update', { affected: 1 } as UpdateResult);

      const response = await supertestWithToken
        .patch(`/users/${user?.uuid}/last-name`)
        .send({ lastName: faker.name.lastName() });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ affected: 1 });
    });

    it('should return 401 when token is missing', async () => {
      const response = await testApp.supertest.patch('/users/56a3ee4c-29c2-496b-8c42-37b0af2c71ef/last-name');

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 401 when token is invalid', async () => {
      const response = await testApp.supertest
        .patch('/users/56a3ee4c-29c2-496b-8c42-37b0af2c71ef/last-name')
        .set('Authorization', 'Bearer invalid');

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 403 when user is not the same as the one in the token', async () => {
      userRepositoryMock.getMockedMethodValue('findOneOrFail');

      const response = await supertestWithToken
        .patch('/users/56a3ee4c-29c2-496b-8c42-37b0af2c71ef/last-name')
        .send({ lastName: faker.name.lastName() });

      expect(response.statusCode).toBe(403);
      expect(response.body.message).toEqual(UserErrors.NotSelf);
    });
  });
});
