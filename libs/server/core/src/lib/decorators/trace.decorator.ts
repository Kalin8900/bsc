import { applyDecorators, UseInterceptors } from '@nestjs/common';

import { TracingInterceptor } from '../interceptors/tracing.interceptor';

export const Trace = () => applyDecorators(UseInterceptors(TracingInterceptor));
