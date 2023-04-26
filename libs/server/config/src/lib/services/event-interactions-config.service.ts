import { Injectable } from '@nestjs/common';

import { EventInteractionsConfig } from '../configs';
import { ConfigResolverService } from './config-resolver.service';

@Injectable()
export class EventInteractionsConfigService {
  constructor(private readonly configResolverService: ConfigResolverService) {}

  get config() {
    return this.configResolverService.resolve<EventInteractionsConfig>('eventInteractions');
  }

  get coolDown() {
    return this.configResolverService.resolve<EventInteractionsConfig['coolDown']>('eventInteractions.coolDown');
  }

  get max() {
    return this.configResolverService.resolve<EventInteractionsConfig['max']>('eventInteractions.max');
  }
}
