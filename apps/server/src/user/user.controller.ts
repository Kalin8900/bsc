import { UserNotFoundException } from '@joinus/server/base';
import {
  EmailDto,
  PhoneDto,
  Respond,
  UpdateResultDto,
  UuidDto,
  EntityNotFoundErrorFilter,
  DeleteResultDto,
  PageDto,
  LogRequest,
  Monitor
} from '@joinus/server/core';
import { Body, Controller, Delete, Get, Param, Patch, Put, Query, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth';
import { FirstNameDto, LastsNameDto, UserUpdateDto, UserDto } from './dto';
import { UserExistsPipe, UserSelfPipe } from './pipes';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
@AuthGuard()
@LogRequest()
@Monitor()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @Respond([UserDto])
  public async getAll(@Query() page: PageDto) {
    return this.userService.getAll([], page);
  }

  @Get(':uuid')
  @Respond(UserDto)
  @UseFilters(new EntityNotFoundErrorFilter((message) => new UserNotFoundException([message])))
  public async getOne(@Param() { uuid }: UuidDto) {
    return this.userService.getOne(uuid);
  }

  @Put(':uuid')
  @Respond(UserDto)
  public async update(@Body(UserSelfPipe(), UserExistsPipe()) dto: UserUpdateDto) {
    return this.userService.update(dto);
  }

  @Patch(':uuid/phone')
  @Respond(UpdateResultDto)
  public async updatePhone(@Param(UserSelfPipe(), UserExistsPipe()) { uuid }: UuidDto, @Body() { phone }: PhoneDto) {
    return this.userService.updateProperty(uuid, 'phone', phone);
  }

  @Patch(':uuid/email')
  @Respond(UpdateResultDto)
  public async updateEmail(@Param(UserSelfPipe(), UserExistsPipe()) { uuid }: UuidDto, @Body() { email }: EmailDto) {
    return this.userService.updateProperty(uuid, 'email', email);
  }

  @Patch(':uuid/first-name')
  @Respond(UpdateResultDto)
  public async updateFirstName(
    @Param(UserSelfPipe(), UserExistsPipe()) { uuid }: UuidDto,
    @Body() { firstName }: FirstNameDto
  ) {
    return this.userService.updateProperty(uuid, 'firstName', firstName);
  }

  @Patch(':uuid/last-name')
  @Respond(UpdateResultDto)
  public async updateLastName(
    @Param(UserSelfPipe(), UserExistsPipe()) { uuid }: UuidDto,
    @Body() { lastName }: LastsNameDto
  ) {
    return this.userService.updateProperty(uuid, 'lastName', lastName);
  }

  @Delete(':uuid')
  @Respond(DeleteResultDto)
  public async delete(@Param(UserSelfPipe(), UserExistsPipe()) { uuid }: UuidDto) {
    return this.userService.delete(uuid);
  }
}
