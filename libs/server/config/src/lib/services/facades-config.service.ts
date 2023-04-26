import { Injectable } from '@nestjs/common';

import { MapboxConfig } from '../configs';
import { ConfigResolverService } from './config-resolver.service';

@Injectable()
export class FacadesConfigService {
  constructor(private readonly configResolverService: ConfigResolverService) {}

  get mapbox() {
    return this.configResolverService.resolve<MapboxConfig>('mapbox');
  }
}
