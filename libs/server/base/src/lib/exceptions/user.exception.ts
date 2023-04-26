import { HttpStatus } from '@nestjs/common';

import { CoreException } from './core.exception';

export class UserException extends CoreException {
  constructor(message: string, code?: HttpStatus, errors?: string[]) {
    super('UserException', message, code ?? HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }
}

export class UserNotFoundException extends UserException {
  constructor(errors?: string[]) {
    super('User not found', HttpStatus.NOT_FOUND, errors);
  }
}

export class UserAlreadyExistsException extends UserException {
  constructor(errors?: string[]) {
    super('User already exists', HttpStatus.CONFLICT, errors);
  }
}

export class UserNotSelfException extends UserException {
  constructor(errors?: string[]) {
    super('User not self', HttpStatus.FORBIDDEN, errors);
  }
}
