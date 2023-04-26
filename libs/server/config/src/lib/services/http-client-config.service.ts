import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';

import { ConfigResolverService } from './config-resolver.service';

@Injectable()
export class HttpClientConfigService {
  constructor(private readonly configResolverService: ConfigResolverService) {}

  get config() {
    return this.configResolverService.resolve<AxiosRequestConfig>('httpClient');
  }
}
