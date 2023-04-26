import { createMock } from '@golevelup/ts-jest';
import { ArgumentsHost, HttpException } from '@nestjs/common';

import { NotFoundExceptionFilter } from './not-found-exception.filter';

describe('not-found-exception-filter', () => {
  let notFoundExceptionFilter: NotFoundExceptionFilter;

  beforeEach(() => {
    notFoundExceptionFilter = new NotFoundExceptionFilter();
  });

  describe('catch', () => {
    const host = createMock<ArgumentsHost>();

    beforeAll(() => {
      host.switchToHttp.mockReturnValue({
        getResponse: () => ({
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockImplementation((response) => response)
        })
      } as any);
    });

    it('catch', async () => {
      const httpException = new HttpException('test', 500);

      const notFoundCatch = await notFoundExceptionFilter.catch(httpException, host);
      expect(notFoundCatch.statusCode).toBe(404);
      expect(notFoundCatch.message).toBe('This route does not exist');
    });
  });
});
