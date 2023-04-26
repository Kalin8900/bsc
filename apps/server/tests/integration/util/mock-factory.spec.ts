import { MockFactory } from './mock-factory';

class Test {
  public test() {
    return 'test';
  }

  public async asyncTest() {
    return Promise.resolve('asyncTest');
  }

  public property = 'property';

  private privateMethod() {
    return 'privateMethod';
  }

  private async privateAsyncMethod() {
    return Promise.resolve('privateAsyncMethod');
  }

  private readonly privateProperty = 'privateProperty';
}

describe('MockFactory', () => {
  it('should create a mock', () => {
    const { mock } = new MockFactory<Test>();
    expect(mock).toBeDefined();
    expect(mock.asyncTest).toBeDefined();
    expect(mock.property).toBeDefined();
    expect(mock.test).toBeDefined();
  });

  describe('sync', () => {
    it('should override a method', () => {
      const override = 'override';

      const mock = new MockFactory<Test>().mockSyncMethod('test', override);

      expect(mock.mock.test()).toEqual(override);
    });

    it('should override only sync methods', () => {
      const mock = new MockFactory<Test>();

      // @ts-expect-error - asyncTest is not a sync method
      mock.mockSyncMethod('asyncTest', 'override');

      // @ts-expect-error - property is not a method
      mock.mockSyncMethod('property', 'override');
    });

    it('should override only public methods', () => {
      const mock = new MockFactory<Test>();

      // @ts-expect-error - privateMethod is not a public method
      mock.mockSyncMethod('privateMethod', 'override');
    });

    it('should save overridden method value', () => {
      const override = 'override';

      const mock = new MockFactory<Test>().mockSyncMethod('test', override);

      expect(mock.getMockedMethodValue('test')).toEqual(override);
    });

    it('should save and return the same overridden method value', () => {
      const override = 'override';

      const mock = new MockFactory<Test>().mockSyncMethod('test', override);

      expect(mock.mock.test()).toEqual(override);
      expect(mock.getMockedMethodValue('test')).toEqual(override);
      expect(mock.mock.test()).toEqual(mock.getMockedMethodValue('test'));
    });

    it('should mock throw an error', () => {
      const mock = new MockFactory<Test>().mockRejectSyncMethod('test', new Error('test'));

      expect(() => mock.mock.test()).toThrowError('test');
    });

    it('should delete overridden method value', () => {
      const mock = new MockFactory<Test>()
        .mockSyncMethod('test', 'overridden')
        .mockRejectSyncMethod('test', new Error('test'));

      expect(mock.getMockedMethodValue('test')).toBeUndefined();
    });
  });

  describe('async', () => {
    it('should override a method', async () => {
      const override = 'override';

      const mock = new MockFactory<Test>().mockAsyncMethod('asyncTest', override);

      expect(await mock.mock.asyncTest()).toEqual(override);
    });

    it('should override only async methods', async () => {
      const mock = new MockFactory<Test>();

      // @ts-expect-error - test is not an async method
      mock.mockAsyncMethod('test', 'override');

      // @ts-expect-error - property is not a method
      mock.mockAsyncMethod('property', 'override');
    });

    it('should override only public methods', async () => {
      const mock = new MockFactory<Test>();

      // @ts-expect-error - privateAsyncMethod is not a public method
      mock.mockAsyncMethod('privateAsyncMethod', 'override');
    });

    it('should save overridden method value', async () => {
      const override = 'override';

      const mock = new MockFactory<Test>().mockAsyncMethod('asyncTest', override);

      expect(mock.getMockedMethodValue('asyncTest')).toEqual(override);
    });

    it('should save and return the same overridden method value', async () => {
      const override = 'override';

      const mock = new MockFactory<Test>().mockAsyncMethod('asyncTest', override);

      expect(await mock.mock.asyncTest()).toEqual(override);
      expect(mock.getMockedMethodValue('asyncTest')).toEqual(override);
      expect(await mock.mock.asyncTest()).toEqual(mock.getMockedMethodValue('asyncTest'));
    });

    it('should mock throw an error', async () => {
      const mock = new MockFactory<Test>().mockRejectAsyncMethod('asyncTest', new Error('test'));

      await expect(mock.mock.asyncTest()).rejects.toThrowError('test');
    });

    it('should delete overridden method value', async () => {
      const mock = new MockFactory<Test>()
        .mockAsyncMethod('asyncTest', 'overridden')
        .mockRejectAsyncMethod('asyncTest', new Error('test'));

      expect(mock.getMockedMethodValue('asyncTest')).toBeUndefined();
    });
  });
});
