export class DataGenerator<T extends object> {
  private readonly callback: (index: number) => Promise<T> | T;
  private count: number;

  constructor(callback: (index: number) => Promise<T> | T) {
    this.callback = callback;
    this.count = 0;
  }

  public generate(data?: Partial<T>): T {
    const result = this.callback(this.count) as T;

    this.count += 1;

    return { ...result, ...data };
  }

  public async generateAsync(data?: Partial<T>): Promise<T> {
    const result = await this.callback(this.count);

    this.count += 1;

    return { ...result, ...data };
  }

  public generateMany(count: number, data?: Partial<T>): T[] {
    const result = [];

    for (let i = 0; i < count; i += 1) {
      result.push(this.generate(data));
    }

    return result;
  }

  public async generateManyAsync(count: number, data?: Partial<T>): Promise<T[]> {
    const result = [];

    for (let i = 0; i < count; i += 1) {
      result.push(await this.generateAsync(data));
    }

    return result;
  }
}
