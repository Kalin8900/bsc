import { Global, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { MetricsManager } from './metrics.manager';
import { MetricsRegistry } from './metrics.registry';
import { MonitoringController } from './monitoring.controller';
import { MonitoringExplorer } from './monitoring.explorer';
import { MonitoringService } from './monitoring.service';

@Global()
@Module({
  imports: [DiscoveryModule],
  controllers: [MonitoringController],
  providers: [MonitoringService, MetricsRegistry, MetricsManager, MonitoringExplorer],
  exports: [MonitoringService]
})
export class MonitoringModule {}
