import { CoolDownDto, LogRequest, Monitor, Respond, UuidDto } from '@joinus/server/core';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard, AuthUuid } from '../auth';
import { EventNodeDto } from '../event-recommendations';
import {
  AttendingRelationDto,
  DislikesRelationDto,
  InterestedRelationDto,
  LikesRelationDto,
  RatedRelationDto,
  SuperlikesRelationDto,
  RatingDto
} from './dto';
import { EventInteractionsService } from './event-interactions.service';

@Controller('events/interactions')
@ApiTags('Events Interactions', 'Events')
@AuthGuard()
@LogRequest()
@Monitor()
export class EventInteractionsController {
  constructor(private readonly eventInteractionsService: EventInteractionsService) {}

  @Get('like')
  @Respond([EventNodeDto])
  async getLiked(@AuthUuid() uuid: string) {
    return this.eventInteractionsService.strategy('like').get(uuid);
  }

  @Post(':uuid/like')
  @Respond(LikesRelationDto)
  async like(@AuthUuid() uuid: string, @Param() { uuid: eventUuid }: UuidDto) {
    return this.eventInteractionsService.strategy('like').do(uuid, eventUuid);
  }

  @Delete(':uuid/like')
  @Respond(EventNodeDto)
  async unlike(@AuthUuid() uuid: string, @Param() { uuid: eventUuid }: UuidDto) {
    return this.eventInteractionsService.strategy('like').undo(uuid, eventUuid);
  }

  @Get('dislike')
  @Respond([EventNodeDto])
  async getDisliked(@AuthUuid() uuid: string) {
    return this.eventInteractionsService.strategy('dislike').get(uuid);
  }

  @Post(':uuid/dislike')
  @Respond(DislikesRelationDto)
  async dislike(@AuthUuid() uuid: string, @Param() { uuid: eventUuid }: UuidDto) {
    return this.eventInteractionsService.strategy('dislike').do(uuid, eventUuid);
  }

  @Delete(':uuid/dislike')
  @Respond(EventNodeDto)
  async undislike(@AuthUuid() uuid: string, @Param() { uuid: eventUuid }: UuidDto) {
    return this.eventInteractionsService.strategy('dislike').undo(uuid, eventUuid);
  }

  @Get('rate')
  @Respond([EventNodeDto])
  async getRated(@AuthUuid() uuid: string) {
    return this.eventInteractionsService.strategy('rate').get(uuid);
  }

  @Get(':uuid/rate')
  @Respond(RatingDto)
  async getRate(@AuthUuid() uuid: string, @Param() { uuid: eventUuid }: UuidDto) {
    return this.eventInteractionsService.getRating(uuid, eventUuid);
  }

  @Post(':uuid/rate')
  @Respond(RatedRelationDto)
  async rate(@AuthUuid() uuid: string, @Param() { uuid: eventUuid }: UuidDto, @Body() { rating }: RatingDto) {
    return this.eventInteractionsService.strategy('rate').do(uuid, eventUuid, { relation: { rating } });
  }

  @Delete(':uuid/rate')
  @Respond(EventNodeDto)
  async unrate(@AuthUuid() uuid: string, @Param() { uuid: eventUuid }: UuidDto) {
    return this.eventInteractionsService.strategy('rate').undo(uuid, eventUuid);
  }

  @Get('interest')
  @Respond([EventNodeDto])
  async getInterested(@AuthUuid() uuid: string) {
    return this.eventInteractionsService.strategy('interest').get(uuid);
  }

  @Post(':uuid/interest')
  @Respond(InterestedRelationDto)
  async interest(@AuthUuid() uuid: string, @Param() { uuid: eventUuid }: UuidDto) {
    return this.eventInteractionsService.strategy('interest').do(uuid, eventUuid);
  }

  @Delete(':uuid/interest')
  @Respond(EventNodeDto)
  async uninterest(@AuthUuid() uuid: string, @Param() { uuid: eventUuid }: UuidDto) {
    return this.eventInteractionsService.strategy('interest').undo(uuid, eventUuid);
  }

  @Get('attend')
  @Respond([EventNodeDto])
  async getAttended(@AuthUuid() uuid: string) {
    return this.eventInteractionsService.strategy('attend').get(uuid);
  }

  @Post(':uuid/attend')
  @Respond(AttendingRelationDto)
  async attend(@AuthUuid() uuid: string, @Param() { uuid: eventUuid }: UuidDto) {
    return this.eventInteractionsService.strategy('attend').do(uuid, eventUuid);
  }

  @Delete(':uuid/attend')
  @Respond(EventNodeDto)
  async unattend(@AuthUuid() uuid: string, @Param() { uuid: eventUuid }: UuidDto) {
    return this.eventInteractionsService.strategy('attend').undo(uuid, eventUuid);
  }

  @Get('superlike')
  @Respond([EventNodeDto])
  async getSuperliked(@AuthUuid() uuid: string) {
    return this.eventInteractionsService.strategy('superlike').get(uuid);
  }

  @Post(':uuid/superlike')
  @Respond(SuperlikesRelationDto)
  async superlike(@AuthUuid() uuid: string, @Param() { uuid: eventUuid }: UuidDto) {
    return this.eventInteractionsService.strategy('superlike').do(uuid, eventUuid);
  }

  @Get('superlike/cool-down')
  @Respond(CoolDownDto)
  async getCoolDown(@AuthUuid() uuid: string) {
    return this.eventInteractionsService.getCoolDown(uuid);
  }
}
