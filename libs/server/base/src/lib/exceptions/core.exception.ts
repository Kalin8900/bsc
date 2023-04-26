import { HttpException } from '@nestjs/common';

export interface IException extends HttpException {
  errors?: string[];
  timestamp?: Date;
}

export class CoreException extends HttpException implements IException {
  constructor(
    name: string,
    message: string,
    statusCode: number,
    public readonly errors?: string[]
  ) {
    super({ message, errors, statusCode, name, timestamp: new Date() }, statusCode);
  }
}
