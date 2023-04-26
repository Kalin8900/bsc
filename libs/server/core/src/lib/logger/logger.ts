import { Logger } from '@nestjs/common';

// TODO: Add third party logger

export class Log {
  private readonly logger: Logger;
  private readonly context: string;
  private static readonly isLocal: boolean = true; // FIXME: use some env

  constructor(context: string) {
    this.logger = new Logger(context);
    this.context = context;
  }

  private static formatMessage(message: string, data?: Record<string, any>) {
    if (!data) return message;

    return `${message} - data: ${JSON.stringify(data)}`;
  }

  static info(message: string, data?: Record<string, any>, context?: string) {
    if (this.isLocal) {
      return context !== undefined
        ? Logger.log(this.formatMessage(message, data), context)
        : Logger.log(this.formatMessage(message, data));
    }
  }

  info(message: string, data?: Record<string, any>) {
    if (Log.isLocal) this.logger.log(Log.formatMessage(message, data));
  }

  static error(message: string, data?: Record<string, any>, context?: string) {
    if (this.isLocal) {
      return context !== undefined
        ? Logger.error(this.formatMessage(message, data), context)
        : Logger.error(this.formatMessage(message, data));
    }
  }

  error(message: string, data?: Record<string, any>) {
    if (Log.isLocal) this.logger.error(Log.formatMessage(message, data), undefined);
  }

  static warn(message: string, data?: Record<string, any>, context?: string) {
    if (this.isLocal) {
      return context !== undefined
        ? Logger.warn(this.formatMessage(message, data), context)
        : Logger.warn(this.formatMessage(message, data));
    }
  }

  warn(message: string, data?: Record<string, any>) {
    if (Log.isLocal) this.logger.warn(Log.formatMessage(message, data));
  }

  static debug(message: string, data?: Record<string, any>, context?: string) {
    if (this.isLocal) {
      return context !== undefined
        ? Logger.debug(this.formatMessage(message, data), context)
        : Logger.debug(this.formatMessage(message, data));
    }
  }

  debug(message: string, data?: Record<string, any>) {
    if (Log.isLocal) this.logger.debug(Log.formatMessage(message, data));
  }
}
