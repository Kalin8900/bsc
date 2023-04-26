import { timingSafeEqual } from 'crypto';

import { Injectable } from '@nestjs/common';

import { BasicAuthUser } from './basic-auth.types';

@Injectable()
export class BasicAuthService {
  public validate(reqUser: BasicAuthUser, users: BasicAuthUser[]): boolean {
    const user = users.find((u) => u.username === reqUser.username);

    if (user && this.safeCompare(reqUser.password, user.password)) {
      return true;
    }

    return false;
  }

  private safeCompare(input: string, secret: string): boolean {
    const userInputLength = Buffer.byteLength(input);
    const secretLength = Buffer.byteLength(secret);

    const userInputBuffer = Buffer.alloc(userInputLength, 0, 'utf8');
    userInputBuffer.write(input);
    const secretBuffer = Buffer.alloc(userInputLength, 0, 'utf8');
    secretBuffer.write(secret);

    return timingSafeEqual(userInputBuffer, secretBuffer) && userInputLength === secretLength;
  }
}
