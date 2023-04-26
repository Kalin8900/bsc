import { HttpClient, HttpClientConfig } from './http-client.types';

export const httpClientFactory = (config?: HttpClientConfig) => {
  return new HttpClient(config);
};
