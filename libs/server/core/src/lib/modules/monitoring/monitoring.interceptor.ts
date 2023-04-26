import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

import { MonitoringService } from './monitoring.service';

@Injectable()
export class MonitoringInterceptor implements NestInterceptor {
  constructor(private readonly monitoringService: MonitoringService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    this.monitoringService.incrementRequestCount(req.url, req.method);

    const start = performance.now();

    return next.handle().pipe(
      tap(() => {
        const end = performance.now();
        const duration = end - start;
        const status = context.switchToHttp().getResponse().statusCode;

        this.monitoringService.observeRequestDuration(req.url, req.method, status.toString(), duration);
      })
    );
  }
}
