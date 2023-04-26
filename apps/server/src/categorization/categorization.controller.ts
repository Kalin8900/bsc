import { LogRequest, Monitor, Respond } from '@joinus/server/core';
import { Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth';
import { CategoryExistsFactory } from '../category';
import { EventAuthorPipe } from '../event';
import { EventNodeDto } from '../event-recommendations';
import { CategorizationService } from './categorization.service';
import { CategorizationDto, EventCategoryRelationDto } from './dto';

@ApiTags('Categorization', 'Events')
@Controller('events')
@AuthGuard()
@LogRequest()
@Monitor()
export class CategorizationController {
  constructor(private readonly categorizationService: CategorizationService) {}

  @Post(':uuid/categories/:categoryUuid')
  @Respond(EventCategoryRelationDto)
  public async setCategory(
    @Param(EventAuthorPipe, CategoryExistsFactory<CategorizationDto>((dto) => dto.categoryUuid))
    { uuid, categoryUuid }: CategorizationDto
  ) {
    return this.categorizationService.setCategory(uuid, categoryUuid);
  }

  @Delete(':uuid/categories/:categoryUuid')
  @Respond(EventNodeDto)
  public async removeCategory(
    @Param(EventAuthorPipe, CategoryExistsFactory<CategorizationDto>((dto) => dto.categoryUuid))
    { uuid, categoryUuid }: CategorizationDto
  ) {
    return this.categorizationService.removeCategory(uuid, categoryUuid);
  }
}
