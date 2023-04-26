import { HttpStatus } from '@nestjs/common';

import { CoreException } from './core.exception';

export class FriendException extends CoreException {
  constructor(message: string, code?: HttpStatus, errors?: string[]) {
    super('FriendException', message, code ?? HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }
}

export class FriendAlreadyExists extends FriendException {
  constructor(errors?: string[]) {
    super('Friend already exists', HttpStatus.CONFLICT, errors);
  }
}

export class FriendRequestedAlreadySent extends FriendException {
  constructor(errors?: string[]) {
    super('Friend request already sent', HttpStatus.CONFLICT, errors);
  }
}

export class FriendRequestNotFound extends FriendException {
  constructor(errors?: string[]) {
    super('Friend request not found', HttpStatus.NOT_FOUND, errors);
  }
}

export class FriendNotFound extends FriendException {
  constructor(errors?: string[]) {
    super('Friend not found', HttpStatus.NOT_FOUND, errors);
  }
}

export class FriendOrUserNotFound extends FriendException {
  constructor(errors?: string[]) {
    super('Friend or user not found', HttpStatus.NOT_FOUND, errors);
  }
}

export class FriendNotYourself extends FriendException {
  constructor(errors?: string[]) {
    super('You cannot add yourself as a friend', HttpStatus.BAD_REQUEST, errors);
  }
}

export class FriendCheckError extends FriendException {
  constructor(errors?: string[]) {
    super('Friend check error', HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }
}
