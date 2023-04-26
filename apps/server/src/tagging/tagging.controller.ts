import { LogRequest, Monitor, Respond, UuidDto } from '@joinus/server/core';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth';
import { EventAuthorPipe } from '../event';
import { TagCreateDto, TagDeleteDto, TagNodeDto } from './dto';
import { TaggingService } from './tagging.service';

@Controller('events')
@ApiTags('Tagging', 'Events')
@AuthGuard()
@LogRequest()
@Monitor()
export class TaggingController {
  constructor(private readonly taggingService: TaggingService) {}

  @Get(':uuid/tags')
  @Respond([TagNodeDto])
  public async getEventTags(@Param() { uuid }: UuidDto) {
    return this.taggingService.getEventTags(uuid);
  }

  @Post(':uuid/tags')
  @Respond(TagNodeDto)
  public async tag(@Param(EventAuthorPipe) { uuid }: UuidDto, @Body() dto: TagCreateDto) {
    return this.taggingService.tag(uuid, dto);
  }

  @Delete(':uuid/tags/:name')
  @Respond(TagNodeDto)
  public async untag(@Param(EventAuthorPipe) { uuid, name }: TagDeleteDto) {
    return this.taggingService.untag(uuid, name);
  }
}
