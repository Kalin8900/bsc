import { HttpStatus } from '@nestjs/common';

import { CoreException } from './core.exception';

export class ValidationException extends CoreException {
  constructor(message: string, code?: HttpStatus, errors?: string[]) {
    super('ValidationException', message, code ?? HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }
}

export class RequestValidationException extends ValidationException {
  constructor(message: string, errors?: string[]) {
    super(message, HttpStatus.BAD_REQUEST, errors);
  }
}

export class ResponseValidationException extends ValidationException {
  constructor(message: string, errors?: string[]) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }
}
