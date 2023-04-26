import { HttpFacadeModule } from '@joinus/server/core';
import { Module } from '@nestjs/common';

import { MapboxFacade } from './mapbox.facade';

@Module({
  imports: [HttpFacadeModule],
  providers: [MapboxFacade],
  exports: [MapboxFacade]
})
export class FacadesModule {}
