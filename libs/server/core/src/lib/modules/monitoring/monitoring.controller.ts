import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BasicAuth } from '../basic-auth/basic-auth.decorator';
import { BasicAuthUser } from '../basic-auth/basic-auth.types';
import { MonitoringService } from './monitoring.service';

const monitoringCredentials: BasicAuthUser[] = [
  {
    username: process.env.MONITORING_USERNAME ?? 'admin',
    password: process.env.MONITORING_PASSWORD ?? 'admin'
  }
];

@BasicAuth(monitoringCredentials)
@Controller('monitoring')
@ApiTags('Monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('metrics')
  getMetrics() {
    return this.monitoringService.getMetrics();
  }

  @Get('health')
  getHealth() {
    return this.monitoringService.getHealth();
  }

  @Get('info')
  getInfo() {
    return this.monitoringService.getInfo();
  }
}
