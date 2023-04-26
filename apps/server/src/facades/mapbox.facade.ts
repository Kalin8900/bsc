import { FacadesConfigService } from '@joinus/server/config';
import { Dependency, Facade, Health, HttpClientConfig, HttpFacade, MonitoringDependency } from '@joinus/server/core';
import { Injectable } from '@nestjs/common';

@Injectable()
@Dependency('Mapbox')
export class MapboxFacade implements Facade, MonitoringDependency {
  constructor(private readonly httpFacade: HttpFacade, private readonly facadesConfigService: FacadesConfigService) {}

  isUp() {
    return Health.UP;
  }

  public async getTiles(path: string, params: Record<string, any>): Promise<Buffer> {
    const handler = await this.api({ params }).get(path, { responseType: 'arraybuffer' });

    return handler.data as any;
  }

  api(config?: HttpClientConfig | undefined) {
    return this.httpFacade.handler({
      baseURL: this.facadesConfigService.mapbox.baseUrl,
      ...config,
      params: {
        ...config?.params,
        access_token: this.facadesConfigService.mapbox.accessToken
      }
    });
  }
}
