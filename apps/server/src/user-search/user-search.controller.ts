import { LogRequest, Monitor, PageQueryDto, Respond } from '@joinus/server/core';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth';
import { UserSearchEntityDto } from './dto';
import { UserSearchService } from './user-search.service';

@Controller('users/search')
@ApiTags('Users Search', 'Users')
@AuthGuard()
@LogRequest()
@Monitor()
export class UserSearchController {
  constructor(private readonly userSearchService: UserSearchService) {}

  @Get('all')
  @Respond([UserSearchEntityDto])
  public async search(@Query() { query, ...page }: PageQueryDto) {
    return this.userSearchService.search(query, page).then((users) => users.map(this.userSearchService.mapToDto));
  }

  @Get('name')
  @Respond([UserSearchEntityDto])
  public async searchByName(@Query() { query, ...page }: PageQueryDto) {
    return this.userSearchService.searchByName(query, page).then((users) => users.map(this.userSearchService.mapToDto));
  }

  @Get('email')
  @Respond([UserSearchEntityDto])
  public async searchByEmail(@Query() { query, ...page }: PageQueryDto) {
    return this.userSearchService
      .searchBy(query, 'email', page)
      .then((users) => users.map(this.userSearchService.mapToDto));
  }

  @Get('phone')
  @Respond([UserSearchEntityDto])
  public async searchByPhone(@Query() { query, ...page }: PageQueryDto) {
    return this.userSearchService
      .searchBy(query, 'phone', page)
      .then((users) => users.map(this.userSearchService.mapToDto));
  }
}
