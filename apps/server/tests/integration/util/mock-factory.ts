import { createMock, DeepMocked, MockOptions, PartialFuncReturn } from '@golevelup/ts-jest';

import { AsyncMethods, AwaitedMethodValueMap, EnsuredReturnType, SyncMethods } from './types';

export class MockFactory<T extends object> {
  readonly mock: DeepMocked<T>;
  private mockedMethodsValues: AwaitedMethodValueMap<T> = {} as AwaitedMethodValueMap<T>;
  private savedCopy: AwaitedMethodValueMap<T> = {} as AwaitedMethodValueMap<T>;

  constructor(partial?: PartialFuncReturn<T>, mockOptions?: MockOptions) {
    this.mock = createMock<T>(partial, mockOptions);
  }

  public mockSyncMethod<K extends SyncMethods<T>>(method: K, value: EnsuredReturnType<T, K>) {
    (this.mock[method] as jest.Mock<T[K]>).mockReturnValue(value);
    this.mockedMethodsValues[method] = value;

    return this;
  }

  public mockAsyncMethod<K extends AsyncMethods<T>>(method: K, value: Awaited<EnsuredReturnType<T, K>>) {
    (this.mock[method] as jest.Mock).mockResolvedValue(value);
    this.mockedMethodsValues[method] = value;

    return this;
  }

  public mockRejectSyncMethod<K extends SyncMethods<T>>(method: K, error: Error) {
    (this.mock[method] as jest.Mock).mockImplementation(() => {
      throw error;
    });
    delete this.mockedMethodsValues[method];

    return this;
  }

  public mockRejectAsyncMethod<K extends AsyncMethods<T>>(method: K, error: Error) {
    (this.mock[method] as jest.Mock).mockRejectedValue(error);
    delete this.mockedMethodsValues[method];

    return this;
  }

  public getMockedMethodValue<K extends keyof T>(method: K) {
    return this.mockedMethodsValues[method];
  }

  public reset() {
    for (const method of Object.keys(this.mock)) {
      (this.mock[method as keyof T] as jest.Mock).mockReset();
    }

    for (const method of Object.keys(this.mockedMethodsValues)) {
      delete this.mockedMethodsValues[method as keyof T];
    }
  }

  public save() {
    this.savedCopy = { ...this.mockedMethodsValues };

    return this;
  }

  public restore() {
    for (const method of Object.keys(this.savedCopy)) {
      this.mockedMethodsValues[method as keyof T] = this.savedCopy[method as keyof T];
      this.mockAsyncMethod(method as any, this.savedCopy[method as keyof AwaitedMethodValueMap<T>] as any);
    }

    return this;
  }
}
