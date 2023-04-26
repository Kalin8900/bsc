import { Injectable } from '@nestjs/common';

import { AppConfig } from '../configs/app.config';
import { ConfigResolverService } from './config-resolver.service';

@Injectable()
export class AppConfigService {
  constructor(private readonly configResolverService: ConfigResolverService) {}

  get app() {
    return this.configResolverService.resolve<AppConfig>('app');
  }

  get port() {
    return this.configResolverService.resolve<number>('app.port');
  }

  get version() {
    return this.configResolverService.resolve<string>('app.version');
  }

  get name() {
    return this.configResolverService.resolve<string>('app.name');
  }

  get compression() {
    return this.configResolverService.resolve<AppConfig['compression']>('app.compression');
  }

  get bodyParser() {
    return this.configResolverService.resolve<AppConfig['bodyParser']>('app.bodyParser');
  }

  get cors() {
    return this.configResolverService.resolve<AppConfig['corsOptions']>('app.corsOptions');
  }

  get cookieParser() {
    return this.configResolverService.resolve<AppConfig['cookieParser']>('app.cookieParser');
  }
}
