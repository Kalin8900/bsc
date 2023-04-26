import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { BasicAuthService } from './basic-auth.service';

describe('BasicAuthService', () => {
  let service: BasicAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BasicAuthService]
    })
      .useMocker(createMock)
      .compile();

    service = module.get<BasicAuthService>(BasicAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validate', () => {
    it('should return true', () => {
      const users = [
        {
          username: 'test',
          password: 'test'
        }
      ];

      expect(service.validate({ username: 'test', password: 'test' }, users)).toEqual(true);
    });

    it('should return false', () => {
      const users = [
        {
          username: 'test',
          password: 'test'
        }
      ];

      expect(service.validate({ username: 'test', password: 'test2' }, users)).toEqual(false);
    });
  });
});
