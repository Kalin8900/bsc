import { LogRequest, Monitor, PageDto, PointDto, Respond, UuidDto } from '@joinus/server/core';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard, AuthUuid } from '../auth';
import { EventNodeDto, EventRecommendationDto } from './dto';
import { SimilarEventDto } from './dto/event-similar.dto';
import { RecommendationsDto } from './dto/recommendations.dto';
import { EventRecommendationsService } from './event-recommendations.service';

@Controller('events/recommendations')
@ApiTags('Events Recommendations', 'Events')
@AuthGuard()
@Monitor()
@LogRequest()
export class EventRecommendationsController {
  constructor(private readonly eventRecommendationsService: EventRecommendationsService) {}

  // @Get(':uuid')
  // @Respond(EventNodeDto)
  // public async getOne(@Param() { uuid }: UuidDto) {
  //   return this.eventRecommendationsService.getOne(uuid);
  // }

  @Get(':uuid/similar')
  @Respond([SimilarEventDto])
  public async getSimilar(@Param() { uuid }: UuidDto, @Query() query: RecommendationsDto) {
    return this.eventRecommendationsService.getSimilar(
      uuid,
      {
        type: 'Point',
        coordinates: query.coordinates
      },
      {
        take: query.take,
        skip: query.skip
      }
    );
  }

  @Get('user')
  @Respond([EventRecommendationDto])
  public async getRecommendations(@AuthUuid() uuid: string, @Query() query: RecommendationsDto) {
    return this.eventRecommendationsService.getRecommendations(
      uuid,
      {
        type: 'Point',
        coordinates: query.coordinates
      },
      {
        take: query.take,
        skip: query.skip
      }
    );
  }
}
