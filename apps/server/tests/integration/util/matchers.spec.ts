import { uuidRegex } from './matchers';

describe('matchers', () => {
  describe('uuid regexp', () => {
    it('should match a valid uuid', () => {
      expect('c0a80101-0000-0000-0000-000000000000').toMatch(uuidRegex);
    });

    it('should not match an invalid uuid', () => {
      expect('c0a80101-0000-0000-0000-00000000000').not.toMatch(uuidRegex);
    });
  });
});
