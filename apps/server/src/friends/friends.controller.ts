import { LogRequest, Monitor, Respond, UuidDto } from '@joinus/server/core';
import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard, AuthUuid } from '../auth';
import { UserNodeDto } from '../user-recommendations';
import { FriendsRelationDto, FriendsRequestRelationDto } from './dto';
import { FriendsService } from './friends.service';

@Controller('friends')
@ApiTags('Friends')
@AuthGuard()
@LogRequest()
@Monitor()
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get('')
  @Respond([UserNodeDto])
  public async getFriends(@AuthUuid() uuid: string) {
    return this.friendsService.getFriends(uuid);
  }

  @Get('requests')
  @Respond([UserNodeDto])
  public async getFriendRequests(@AuthUuid() uuid: string) {
    return this.friendsService.getFriendRequests(uuid);
  }

  @Post(':uuid/request')
  @Respond(FriendsRequestRelationDto)
  public async sendFriendRequest(@Param() { uuid: friendUuid }: UuidDto, @AuthUuid() uuid: string) {
    return this.friendsService.sendFriendRequest(uuid, friendUuid);
  }

  @Post(':uuid/accept')
  @Respond(FriendsRelationDto)
  public async acceptFriendRequest(@Param() { uuid: friendUuid }: UuidDto, @AuthUuid() uuid: string) {
    return this.friendsService.confirmFriendRequest(uuid, friendUuid);
  }

  @Post(':uuid/decline')
  @Respond(UserNodeDto)
  public async declineFriendRequest(@Param() { uuid: friendUuid }: UuidDto, @AuthUuid() uuid: string) {
    return this.friendsService.declineFriendRequest(uuid, friendUuid);
  }

  @Delete(':uuid')
  @Respond(UserNodeDto)
  public async deleteFriend(@Param() { uuid: friendUuid }: UuidDto, @AuthUuid() uuid: string) {
    return this.friendsService.deleteFriend(uuid, friendUuid);
  }

  @Delete(':uuid/request')
  @Respond(UserNodeDto)
  public async cancelFriendRequest(@Param() { uuid: friendUuid }: UuidDto, @AuthUuid() uuid: string) {
    return this.friendsService.cancelFriendRequest(uuid, friendUuid);
  }
}
