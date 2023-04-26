import { applyDecorators, SetMetadata, Type } from '@nestjs/common';
import { ClassTransformOptions } from 'class-transformer';

export const VALIDATION_CLASS = Symbol('ValidationClass');

export const VALIDATION_OPTIONS = Symbol('ValidationOptions');

export const ValidationMetadata = <T>(cls: Type<T> | [Type<T>], options?: ClassTransformOptions) =>
  applyDecorators(SetMetadata(VALIDATION_CLASS, cls), SetMetadata(VALIDATION_OPTIONS, options));
