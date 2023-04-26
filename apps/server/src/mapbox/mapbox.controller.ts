import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { AuthGuard } from '../auth';
import { MapboxFacade } from '../facades/mapbox.facade';

@Controller('mapbox')
@AuthGuard()
@ApiTags('Mapbox')
export class MapboxController {
  constructor(private readonly mapboxFacade: MapboxFacade) {}

  @Get('tiles/*')
  async tiles(@Res() res: Response, @Query() query: any, @Param() params: any) {
    const data = await this.mapboxFacade.getTiles(params[0], query);

    return res.setHeader('Content-Type', 'image/jpeg').send(data);
  }
}
