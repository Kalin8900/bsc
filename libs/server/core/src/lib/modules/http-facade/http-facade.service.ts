import { Injectable } from '@nestjs/common';

import { HttpClient, HttpClientConfig } from '../http-client';
import { Validator } from '../validation/validator';
import { RequestHandler } from './request.handler';

@Injectable()
export class HttpFacade {
  constructor(private readonly httpClient: HttpClient, private readonly validator: Validator) {}

  public handler(config: HttpClientConfig): RequestHandler {
    return new RequestHandler(config, this.httpClient, this.validator);
  }
}
