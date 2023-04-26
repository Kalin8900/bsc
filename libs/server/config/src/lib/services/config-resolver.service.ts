import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigResolverService {
  constructor(private readonly config: ConfigService) {}

  resolve<T>(config: string): T {
    const value = this.config.get<T>(config);

    if (!value) throw new Error(`Config ${config} not found`);

    return value;
  }
}
