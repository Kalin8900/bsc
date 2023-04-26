import { HttpStatus } from '@nestjs/common';

import { CoreException } from './core.exception';

export class TagException extends CoreException {
  constructor(message: string, code?: HttpStatus, errors?: string[]) {
    super('TagException', message, code ?? HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }
}

export class TagNotFoundException extends TagException {
  constructor(errors?: string[]) {
    super('Tag not found', HttpStatus.NOT_FOUND, errors);
  }
}

export class TagQueryFailedException extends TagException {
  constructor(errors?: string[]) {
    super('Tag query failed', HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }
}

export class TagTooManyException extends TagException {
  constructor(errors?: string[]) {
    super('Too many tags', HttpStatus.BAD_REQUEST, errors);
  }
}
