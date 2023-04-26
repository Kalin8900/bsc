import { UserAlreadyExistsException } from '@joinus/server/base';
import { EmailDto } from '@joinus/server/core';
import { ArgumentMetadata, Inject, Injectable, PipeTransform } from '@nestjs/common';

import { UserService } from '../user.service';

@Injectable()
export class UserNotExistsByEmailPipe implements PipeTransform {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService
  ) {}

  async transform(user: EmailDto, _metadata: ArgumentMetadata) {
    try {
      await this.userService.getOneByEmail(user.email);
    } catch (e) {
      return user;
    }

    throw new UserAlreadyExistsException([`User with email ${user.email} already exists`]);
  }
}
