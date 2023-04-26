import { HttpStatus } from '@nestjs/common';

import { CoreException } from './core.exception';

export class NotFoundException extends CoreException {
  constructor(message: string, errors?: string[]) {
    super('NotFoundException', message, HttpStatus.NOT_FOUND, errors);
  }
}
