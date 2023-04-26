import { HttpStatus } from '@nestjs/common';

import { CoreException } from './core.exception';

export class UnknownException extends CoreException {
  constructor(message: string, errors?: string[]) {
    super('UnknownException', message, HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }
}
