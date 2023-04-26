import { HttpStatus } from '@nestjs/common';

import { CoreException } from './core.exception';

export class SubcategoryException extends CoreException {
  constructor(message: string, code?: HttpStatus, errors?: string[]) {
    super('SubcategoryException', message, code ?? HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }
}
