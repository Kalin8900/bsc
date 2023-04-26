import { RedisOmModule } from '@joinus/server/core';
import { Module } from '@nestjs/common';

import { UserSearchController } from './user-search.controller';
import { UserSearchListener } from './user-search.listener';
import { UserSearchService } from './user-search.service';
import { UserSearchSchema } from './user.search';

@Module({
  imports: [RedisOmModule.forFeature([UserSearchSchema])],
  controllers: [UserSearchController],
  providers: [UserSearchService, UserSearchListener],
  exports: [UserSearchService]
})
export class UserSearchModule {}
