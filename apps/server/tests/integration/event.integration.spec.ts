import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SuperAgentTest } from 'supertest';
import { EntityNotFoundError } from 'typeorm';

import { Auth } from '../../src/auth/entities/auth.entity';
import { Event } from '../../src/event/entities/event.entity';
import { EventModule } from '../../src/event/event.module';
import { User } from '../../src/user';
import { EventErrors, eventGenerator, eventRepositoryMock } from '../factories/event';
import { userGenerator, userRepositoryMock } from '../factories/user';
import { Errors } from './util/errors';
import { TestApp } from './util/test-app';

const UUID = faker.datatype.uuid();

describe('EventModule integration tests', () => {
  let testApp: TestApp;
  let supertestWithToken: SuperAgentTest;

  beforeAll(async () => {
    testApp = await TestApp.create(
      {
        imports: [EventModule]
      },
      [
        {
          typeOrToken: getRepositoryToken(Event),
          value: eventRepositoryMock.mock
        },
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

    supertestWithToken = await testApp.supertestWithUser(UUID);
  });

  afterAll(async () => {
    await testApp.close();
  });

  it('should be defined', () => {
    expect(testApp.app).toBeDefined();
  });

  beforeEach(() => {
    eventRepositoryMock.restore();
  });

  describe('GET /events', () => {
    it('should return 200', async () => {
      const response = await supertestWithToken.get('/events');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        eventRepositoryMock.getMockedMethodValue('find')?.map((event) => ({
          ...event,
          startDate: event.startDate?.toISOString(),
          createdAt: event.createdAt.toISOString(),
          author: {
            ...event.author,
            createdAt: event.author.createdAt.toISOString()
          }
        }))
      );
    });

    it('should return 401 when token is missing', async () => {
      const response = await testApp.supertest.get('/events');

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 401 when token is invalid', async () => {
      const response = await testApp.supertest.get('/events').set('Authorization', 'Bearer invalid');

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });
  });

  describe('GET /events/:uuid', () => {
    it('should return 200', async () => {
      const event = eventRepositoryMock.getMockedMethodValue('findOneOrFail');

      const response = await supertestWithToken.get(`/events/${event?.uuid}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...event,
        startDate: event?.startDate?.toISOString(),
        createdAt: event?.createdAt.toISOString(),
        author: {
          ...event?.author,
          createdAt: event?.author.createdAt.toISOString()
        }
      });
    });

    it('should return 401 when token is missing', async () => {
      const event = eventRepositoryMock.getMockedMethodValue('findOneOrFail');

      const response = await testApp.supertest.get(`/events/${event?.uuid}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 401 when token is invalid', async () => {
      const event = eventRepositoryMock.getMockedMethodValue('findOneOrFail');

      const response = await testApp.supertest.get(`/events/${event?.uuid}`).set('Authorization', 'Bearer invalid');

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 404 when event is not found', async () => {
      eventRepositoryMock.mock.findOneOrFail.mockRejectedValueOnce(new EntityNotFoundError(Event, 'invalid'));

      const response = await supertestWithToken.get(`/events/${faker.datatype.uuid()}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual(EventErrors.NotFound);
    });

    it('should return 400 when uuid is invalid', async () => {
      const response = await supertestWithToken.get('/events/invalid');

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(Errors.RequestValidationError);
    });
  });

  describe('POST /events', () => {
    it('should return 201', async () => {
      const event = eventRepositoryMock.getMockedMethodValue('findOneOrFail');

      const response = await supertestWithToken.post('/events').send({
        name: faker.lorem.words(),
        description: faker.lorem.paragraph(),
        startDate: faker.date.future(),
        location: {
          type: 'Point',
          coordinates: [Number(faker.address.longitude()), Number(faker.address.latitude())]
        }
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        ...event,
        startDate: event?.startDate?.toISOString(),
        createdAt: event?.createdAt.toISOString(),
        author: {
          ...event?.author,
          createdAt: event?.author.createdAt.toISOString()
        }
      });
    });

    it('should return 401 when token is missing', async () => {
      const response = await testApp.supertest.post('/events').send({
        name: faker.lorem.words(),
        description: faker.lorem.paragraph(),
        startDate: faker.date.future(),
        location: {
          type: 'Point',
          coordinates: [Number(faker.address.longitude()), Number(faker.address.latitude())]
        }
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 401 when token is invalid', async () => {
      const response = await testApp.supertest
        .post('/events')
        .set('Authorization', 'Bearer invalid')
        .send({
          name: faker.lorem.words(),
          description: faker.lorem.paragraph(),
          startDate: faker.date.future(),
          location: {
            type: 'Point',
            coordinates: [Number(faker.address.longitude()), Number(faker.address.latitude())]
          }
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 400 when request body is invalid', async () => {
      const response = await supertestWithToken.post('/events').send({
        name: faker.lorem.words(),
        description: faker.lorem.paragraph(),
        startDate: faker.date.future()
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(Errors.RequestValidationError);
    });
  });

  describe('PUT /events/:uuid', () => {
    beforeEach(() => {
      eventRepositoryMock.mockAsyncMethod(
        'findOneOrFail',
        eventGenerator.generate({
          author: {
            ...userGenerator.generate(),
            uuid: UUID
          }
        })
      );

      userRepositoryMock.mockAsyncMethod(
        'findOneOrFail',
        userGenerator.generate({
          uuid: UUID
        })
      );
    });

    it('should return 200', async () => {
      const event = eventRepositoryMock.getMockedMethodValue('findOneOrFail');

      const response = await supertestWithToken.put(`/events/${event?.uuid}`).send(
        eventGenerator.generate({
          createdAt: undefined,
          uuid: undefined,
          author: undefined
        })
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        ...event,
        startDate: event?.startDate?.toISOString(),
        createdAt: event?.createdAt.toISOString(),
        author: {
          ...event?.author,
          createdAt: event?.author.createdAt.toISOString()
        }
      });
    });

    it('should return 401 when token is missing', async () => {
      const event = eventRepositoryMock.getMockedMethodValue('findOneOrFail');

      const response = await testApp.supertest.put(`/events/${event?.uuid}`).send(
        eventGenerator.generate({
          createdAt: undefined,
          uuid: undefined,
          author: undefined
        })
      );

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 401 when token is invalid', async () => {
      const event = eventRepositoryMock.getMockedMethodValue('findOneOrFail');

      const response = await testApp.supertest
        .put(`/events/${event?.uuid}`)
        .set('Authorization', 'Bearer invalid')
        .send(
          eventGenerator.generate({
            createdAt: undefined,
            uuid: undefined,
            author: undefined
          })
        );

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 404 when event is not found', async () => {
      eventRepositoryMock.mockRejectAsyncMethod('findOneOrFail', new EntityNotFoundError(Event, 'invalid'));

      const response = await supertestWithToken.put(`/events/${faker.datatype.uuid()}`).send(
        eventGenerator.generate({
          createdAt: undefined,
          uuid: undefined,
          author: undefined
        })
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual(EventErrors.NotFound);
    });

    it('should return 400 when request body is invalid', async () => {
      const event = eventRepositoryMock.getMockedMethodValue('findOneOrFail');

      const response = await supertestWithToken.put(`/events/${event?.uuid}`).send({
        name: faker.lorem.words(),
        description: 123
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(Errors.RequestValidationError);
    });

    it('should return 403 when user is not the author', async () => {
      const event = eventRepositoryMock.getMockedMethodValue('findOneOrFail');

      userRepositoryMock.mockAsyncMethod(
        'findOneOrFail',
        userGenerator.generate({
          uuid: faker.datatype.uuid()
        })
      );

      const response = await supertestWithToken.put(`/events/${event?.uuid}`).send(
        eventGenerator.generate({
          createdAt: undefined,
          uuid: undefined,
          author: undefined
        })
      );

      expect(response.status).toBe(403);
      expect(response.body.message).toEqual(EventErrors.NotAuthor);
    });
  });

  describe('DELETE /events/:uuid', () => {
    beforeEach(() => {
      eventRepositoryMock.mockAsyncMethod(
        'findOneOrFail',
        eventGenerator.generate({
          author: {
            ...userGenerator.generate(),
            uuid: UUID
          }
        })
      );

      userRepositoryMock.mockAsyncMethod(
        'findOneOrFail',
        userGenerator.generate({
          uuid: UUID
        })
      );
    });

    it('should return 200', async () => {
      const event = eventRepositoryMock.getMockedMethodValue('findOneOrFail');

      const response = await supertestWithToken.delete(`/events/${event?.uuid}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        affected: 1
      });
    });

    it('should return 401 when token is missing', async () => {
      const event = eventRepositoryMock.getMockedMethodValue('findOneOrFail');

      const response = await testApp.supertest.delete(`/events/${event?.uuid}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 401 when token is invalid', async () => {
      const event = eventRepositoryMock.getMockedMethodValue('findOneOrFail');

      const response = await testApp.supertest.delete(`/events/${event?.uuid}`).set('Authorization', 'Bearer invalid');

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual(Errors.MissingToken);
    });

    it('should return 404 when event is not found', async () => {
      eventRepositoryMock.mockRejectAsyncMethod('findOneOrFail', new EntityNotFoundError(Event, 'invalid'));

      const response = await supertestWithToken.delete(`/events/${faker.datatype.uuid()}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toEqual(EventErrors.NotFound);
    });

    it('should return 403 when user is not the author', async () => {
      const event = eventRepositoryMock.getMockedMethodValue('findOneOrFail');

      userRepositoryMock.mockAsyncMethod(
        'findOneOrFail',
        userGenerator.generate({
          uuid: faker.datatype.uuid()
        })
      );

      const response = await supertestWithToken.delete(`/events/${event?.uuid}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toEqual(EventErrors.NotAuthor);
    });
  });
});
