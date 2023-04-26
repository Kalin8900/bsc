import { UserNotFoundException } from '@joinus/server/base';
import { ArgumentMetadata, Injectable, mixin, PipeTransform } from '@nestjs/common';

import { UserService } from '../user.service';

export function UserExistsPipe<T = any>(extractor?: (dto: T) => string) {
  @Injectable()
  class UserExistsPipeClass implements PipeTransform {
    constructor(readonly userService: UserService) {}

    async transform(value: any, _metadata: ArgumentMetadata) {
      try {
        if (extractor) await this.userService.getOne(extractor(value));
        else await this.userService.getOne(value.uuid);
      } catch (e) {
        throw new UserNotFoundException([`User ${extractor ? extractor(value) : value} does not exist`]);
      }

      return value;
    }
  }

  return mixin(UserExistsPipeClass);
}
