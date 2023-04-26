import { UserAlreadyExistsException } from '@joinus/server/base';
import { ArgumentMetadata, Inject, Injectable, mixin, PipeTransform } from '@nestjs/common';

import { UserService } from '../user.service';

export function UserNotExistsPipe<T = any>(extractor?: (dto: T) => string) {
  @Injectable()
  class UserNotExistsPipeClass implements PipeTransform {
    constructor(
      @Inject(UserService)
      private readonly userService: UserService
    ) {}

    async transform(value: any, _metadata: ArgumentMetadata) {
      try {
        if (extractor) await this.userService.getOne(extractor(value));
        else await this.userService.getOne(value.uuid);
      } catch (e) {
        return value;
      }

      throw new UserAlreadyExistsException([`User with uuid ${value.uuid} already exists`]);
    }
  }

  return mixin(UserNotExistsPipeClass);
}
