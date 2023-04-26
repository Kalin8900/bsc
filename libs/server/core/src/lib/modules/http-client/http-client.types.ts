import { ModuleMetadata } from '@nestjs/common';
import { Axios, AxiosRequestConfig } from 'axios';

export const HttpClientOptions = Symbol('HttpClientOptions');

export class HttpClient extends Axios {
  constructor(config?: AxiosRequestConfig) {
    super(config);
  }
}

export type HttpClientConfig = AxiosRequestConfig;

export interface HttpClientModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useFactory: (...args: any[]) => Promise<HttpClientConfig> | HttpClientConfig;
}
