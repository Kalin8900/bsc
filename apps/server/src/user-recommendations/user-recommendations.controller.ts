import { LogRequest, Monitor, Respond, UuidDto } from '@joinus/server/core';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth';
import { UserNodeDto } from './dto';
import { UserRecommendationsService } from './user-recommendations.service';

@Controller('users/recommendations')
@ApiTags('Users Recommendations', 'Users')
@AuthGuard()
@LogRequest()
@Monitor()
export class UserRecommendationsController {
  constructor(private readonly userRecommendationsService: UserRecommendationsService) {}

  @Get(':uuid')
  @Respond(UserNodeDto)
  public async getOne(@Param() { uuid }: UuidDto) {
    return this.userRecommendationsService.getOne(uuid);
  }
}
