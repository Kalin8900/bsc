import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { HttpFacade } from './http-facade.service';
import { RequestHandler } from './request.handler';

describe('HttpFacade', () => {
  let service: HttpFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpFacade]
    })
      .useMocker(createMock)
      .compile();

    service = module.get<HttpFacade>(HttpFacade);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return request handler', () => {
    const handler = service.handler({
      url: '/test',
      method: 'GET'
    });

    expect(handler).toBeInstanceOf(RequestHandler);
  });
});
