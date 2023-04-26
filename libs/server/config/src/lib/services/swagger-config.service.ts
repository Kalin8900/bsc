import { Injectable } from '@nestjs/common';

import { SwaggerConfig } from '../configs/swagger.config';
import { ConfigResolverService } from './config-resolver.service';

@Injectable()
export class SwaggerConfigService {
  constructor(private readonly configResolverService: ConfigResolverService) {}

  get swagger() {
    return this.configResolverService.resolve<SwaggerConfig>('swagger');
  }

  get document() {
    return this.configResolverService.resolve<SwaggerConfig['document']>('swagger.document');
  }

  get options() {
    return this.configResolverService.resolve<SwaggerConfig['options']>('swagger.options');
  }
}
