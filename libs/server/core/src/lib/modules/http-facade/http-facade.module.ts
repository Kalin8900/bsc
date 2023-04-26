import { Module } from '@nestjs/common';

import { HttpFacade } from './http-facade.service';

@Module({
  providers: [HttpFacade],
  exports: [HttpFacade]
})
export class HttpFacadeModule {}
