import { Injectable } from '@nestjs/common';

import { MapboxFacade } from '../facades/mapbox.facade';

@Injectable()
export class MapboxService {
  constructor(private readonly mapboxFacade: MapboxFacade) {}
}
