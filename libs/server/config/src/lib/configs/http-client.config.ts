import { AxiosRequestConfig } from 'axios';

import { HttpClientConfigService } from '../services/http-client-config.service';

export default (): { httpClient: AxiosRequestConfig } => ({
  httpClient: {}
});

export const httpClientConfigFactory = (configService: HttpClientConfigService) => {
  const config = configService.config;

  return config;
};
