import { Injectable } from '@nestjs/common';

import { AuthConfig } from '../configs';
import { ConfigResolverService } from './config-resolver.service';

@Injectable()
export class AuthConfigService {
  constructor(private readonly configResolverService: ConfigResolverService) {}

  get auth() {
    return this.configResolverService.resolve<AuthConfig>('auth');
  }

  get github() {
    return this.configResolverService.resolve<AuthConfig['github']>('auth.github');
  }

  get google() {
    return this.configResolverService.resolve<AuthConfig['google']>('auth.google');
  }

  get jwt() {
    return this.configResolverService.resolve<AuthConfig['jwt']>('auth.jwt');
  }
}
