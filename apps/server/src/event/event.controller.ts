import { EventNotFoundException } from '@joinus/server/base';
import {
  EntityNotFoundErrorFilter,
  LogRequest,
  Monitor,
  PageDto,
  PointDto,
  Respond,
  UuidDto
} from '@joinus/server/core';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard, AuthUuid } from '../auth';
import { DescriptionDto, EventCreateDto, EventUpdateDto, EventDto, NameDto, StartDateDto } from './dto';
import { EventService } from './event.service';
import { EventAuthorPipe } from './pipes';

@Controller('events')
@ApiTags('Events')
@AuthGuard()
@LogRequest()
@Monitor()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('')
  @Respond([EventDto])
  public async getAll(@Query() page: PageDto) {
    return this.eventService.getAll([], page);
  }

  @Get(':uuid')
  @Respond(EventDto)
  @UseFilters(new EntityNotFoundErrorFilter((message) => new EventNotFoundException([message])))
  public async getOne(@Param() { uuid }: UuidDto) {
    return this.eventService.getOne(uuid);
  }

  @Post('')
  @Respond(EventDto)
  public async create(@AuthUuid() uuid: string, @Body() dto: EventCreateDto) {
    return this.eventService.create(dto, uuid);
  }

  @Put(':uuid')
  @Respond(EventDto)
  public async update(@Param(EventAuthorPipe) { uuid }: UuidDto, @Body() dto: EventUpdateDto) {
    return this.eventService.update(uuid, dto);
  }

  @Patch(':uuid/name')
  public async updateName(@Param(EventAuthorPipe) { uuid }: UuidDto, @Body() { name }: NameDto) {
    return this.eventService.updateProperty(uuid, 'name', name);
  }

  @Patch(':uuid/description')
  public async updateDescription(@Param(EventAuthorPipe) { uuid }: UuidDto, @Body() { description }: DescriptionDto) {
    return this.eventService.updateProperty(uuid, 'description', description);
  }

  @Patch(':uuid/location')
  public async updateLocation(@Param(EventAuthorPipe) { uuid }: UuidDto, @Body() point: PointDto) {
    return this.eventService.updateProperty(uuid, 'location', point);
  }

  @Patch(':uuid/start-date')
  public async updateStartDate(@Param(EventAuthorPipe) { uuid }: UuidDto, @Body() { startDate }: StartDateDto) {
    return this.eventService.updateProperty(uuid, 'startDate', startDate);
  }

  @Delete(':uuid')
  public async delete(@Param(EventAuthorPipe) { uuid }: UuidDto) {
    return this.eventService.delete(uuid);
  }
}
