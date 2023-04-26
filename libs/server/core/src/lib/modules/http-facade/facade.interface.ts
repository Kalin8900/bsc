import { HttpClientConfig } from '../http-client';
import { RequestHandler } from './request.handler';

export interface Facade {
  api(config?: HttpClientConfig): RequestHandler;
}
