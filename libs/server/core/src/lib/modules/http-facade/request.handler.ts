import { HttpClient, HttpClientConfig } from '../http-client';
import { Validator } from '../validation/validator';
import { ResponseHandler } from './response.handler';

export class RequestHandler {
  constructor(
    public readonly config: HttpClientConfig,
    private readonly httpClient: HttpClient,
    private readonly validator: Validator
  ) {}

  public async get<T extends object>(url: string, config?: HttpClientConfig): Promise<ResponseHandler<T>> {
    return new ResponseHandler(await this.httpClient.get<T>(url, { ...this.config, ...config }), this.validator);
  }

  public async post<T extends object, D = any>(
    url: string,
    data?: D,
    config?: HttpClientConfig
  ): Promise<ResponseHandler<T>> {
    return new ResponseHandler(await this.httpClient.post<T>(url, data, { ...this.config, ...config }), this.validator);
  }

  public async put<T extends object, D = any>(
    url: string,
    data?: D,
    config?: HttpClientConfig
  ): Promise<ResponseHandler<T>> {
    return new ResponseHandler(await this.httpClient.put<T>(url, data, { ...this.config, ...config }), this.validator);
  }

  public async patch<T extends object, D = any>(
    url: string,
    data?: D,
    config?: HttpClientConfig
  ): Promise<ResponseHandler<T>> {
    return new ResponseHandler(
      await this.httpClient.patch<T>(url, data, { ...this.config, ...config }),
      this.validator
    );
  }

  public async delete<T extends object>(url: string, config?: HttpClientConfig): Promise<ResponseHandler<T>> {
    return new ResponseHandler(await this.httpClient.delete<T>(url, { ...this.config, ...config }), this.validator);
  }
}
