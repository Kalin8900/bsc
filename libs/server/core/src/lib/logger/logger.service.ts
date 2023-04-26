import { LoggerService as NestLoggerService } from '@nestjs/common';

import { Log } from './logger';

export class LoggerService implements NestLoggerService {
  log(message: string, context: string, data: Record<string, any>) {
    Log.info(message, { context, data });
  }

  error(message: string, context: string, data: Record<string, any>) {
    Log.error(message, { context, data });
  }

  warn(message: string, context: string, data: Record<string, any>) {
    Log.info(message, { context, data });
  }

  debug?(message: string, context: string, data: Record<string, any>) {
    Log.info(message, { context, data });
  }

  verbose?(message: string, context: string, data: Record<string, any>) {
    Log.info(message, { context, data });
  }
}
