import { LogRequest, Monitor, PageQueryDto, QueryDto, Respond } from '@joinus/server/core';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth';
import { EventSearchEntityDto } from './dto';
import { EventSearchService } from './event-search.service';

@Controller('events/search')
@ApiTags('Events Search', 'Events')
@AuthGuard()
@LogRequest()
@Monitor()
export class EventSearchController {
  constructor(private readonly eventSearchService: EventSearchService) {}

  @Get('all')
  @Respond([EventSearchEntityDto])
  public async search(@Query() { query, ...page }: PageQueryDto) {
    return this.eventSearchService
      .search(query, page)
      .then((events) => events.map((event) => this.eventSearchService.mapToDto(event)));
  }

  @Get('name')
  @Respond([EventSearchEntityDto])
  public async searchByName(@Query() { query, ...page }: PageQueryDto) {
    return this.eventSearchService
      .searchBy(query, 'name', page)
      .then((events) => events.map((event) => this.eventSearchService.mapToDto(event)));
  }

  @Get('description')
  @Respond([EventSearchEntityDto])
  public async searchByDescription(@Query() { query, ...page }: PageQueryDto) {
    return this.eventSearchService
      .searchBy(query, 'description', page)
      .then((events) => events.map((event) => this.eventSearchService.mapToDto(event)));
  }
}
