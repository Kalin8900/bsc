import { HttpStatus } from '@nestjs/common';

import { CoreException } from './core.exception';

export class EventException extends CoreException {
  constructor(message: string, code?: HttpStatus, errors?: string[]) {
    super('EventException', message, code ?? HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }
}

export class EventNotFoundException extends EventException {
  constructor(errors?: string[]) {
    super('Event not found', HttpStatus.NOT_FOUND, errors);
  }
}

export class EventAlreadyExistsException extends EventException {
  constructor(errors?: string[]) {
    super('Event already exists', HttpStatus.CONFLICT, errors);
  }
}

export class EventNotAuthorException extends EventException {
  constructor(errors?: string[]) {
    super('Event not author', HttpStatus.FORBIDDEN, errors);
  }
}
