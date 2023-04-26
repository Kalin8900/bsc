import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import UAParser from 'ua-parser-js';

import { Log } from '../logger/logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    const uaParser = new UAParser(req.headers['user-agent']);

    const browser = uaParser.getBrowser();
    const device = uaParser.getDevice();
    const os = uaParser.getOS();

    const userAgent = {
      browser: browser.name,
      browserVersion: browser.version,
      deviceModel: device.model,
      deviceType: device.type,
      deviceVendor: device.vendor,
      os: os.name,
      osVersion: os.version,
      raw: req.headers['user-agent'] ?? 'User agent not provided'
    };

    Log.info('Request', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      userAgent
    });

    return next.handle();
  }
}
