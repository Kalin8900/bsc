import { Module } from '@nestjs/common';

import { FacadesModule } from '../facades';
import { MapboxController } from './mapbox.controller';
import { MapboxService } from './mapbox.service';

@Module({
  imports: [FacadesModule],
  controllers: [MapboxController],
  providers: [MapboxService]
})
export class MapboxModule {}
