import { HttpStatus } from '@nestjs/common';

import { CoreException } from './core.exception';

export class AuthException extends CoreException {
  constructor(message: string, code?: HttpStatus, errors?: string[]) {
    super('AuthException', message, code ?? HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }
}

export class UnauthorizedException extends AuthException {
  constructor(message: string, errors?: string[]) {
    super(message, HttpStatus.UNAUTHORIZED, errors);
  }
}

export class ForbiddenException extends AuthException {
  constructor(message: string, errors?: string[]) {
    super(message, HttpStatus.FORBIDDEN, errors);
  }
}

export class PasswordNotMatchException extends AuthException {
  constructor(errors?: string[]) {
    super('Password not match', HttpStatus.BAD_REQUEST, errors);
  }
}

export class AuthNotFoundException extends AuthException {
  constructor(errors?: string[]) {
    super('Auth not found', HttpStatus.NOT_FOUND, errors);
  }
}

export class AuthCreationException extends AuthException {
  constructor(errors?: string[]) {
    super('Auth creation failed', HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }
}

export class AuthDeleteException extends AuthException {
  constructor(errors?: string[]) {
    super('Auth delete failed', HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }
}
