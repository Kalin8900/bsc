import { UserNotSelfException } from '@joinus/server/base';
import { ArgumentMetadata, Inject, Injectable, mixin, PipeTransform } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import type { RequestWithUser } from '../../auth';

export function UserSelfPipe<T = any>(extractor?: (dto: T) => string) {
  @Injectable()
  class UserSelfPipeClass implements PipeTransform {
    constructor(
      @Inject(REQUEST)
      readonly request: RequestWithUser
    ) {}

    async transform(user: any, _metadata: ArgumentMetadata) {
      const incoming = extractor ? extractor(user) : user.uuid;
      if (incoming !== this.request.user.uuid) {
        throw new UserNotSelfException(['You are not authorized to perform this action']);
      }

      return user;
    }
  }

  return mixin(UserSelfPipeClass);
}
