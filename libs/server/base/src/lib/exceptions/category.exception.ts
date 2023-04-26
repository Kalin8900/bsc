import { HttpStatus } from '@nestjs/common';

import { CoreException } from './core.exception';

export class CategoryException extends CoreException {
  constructor(message: string, code?: HttpStatus, errors?: string[]) {
    super('CategoryException', message, code ?? HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }
}

export class CategoryNotFoundException extends CategoryException {
  constructor(errors?: string[]) {
    super('Category not found', HttpStatus.NOT_FOUND, errors);
  }
}
