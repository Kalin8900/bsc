import { HttpStatus } from '@nestjs/common';

import { CoreException } from './core.exception';

export class InteractionException extends CoreException {
  constructor(message: string, code?: HttpStatus, errors?: string[]) {
    super('InteractionException', message, code ?? HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }
}

export class InteractionAlreadyExistsException extends InteractionException {
  constructor(message: string, errors?: string[]) {
    super(message, HttpStatus.BAD_REQUEST, errors);
  }
}

export class InteractionQueryException extends InteractionException {
  constructor(message: string, errors?: string[]) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }
}

export class InteractionCoolDownException extends InteractionException {
  constructor(message: string, errors?: string[]) {
    super(message, HttpStatus.BAD_REQUEST, errors);
  }
}
