import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { isFuture } from 'date-fns';

@ValidatorConstraint({ name: 'isFutureDate', async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(date: any): boolean {
    return date instanceof Date && isFuture(date);
  }
}

export const IsFutureDate = (validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: { message: `${propertyName} must be a date in the future`, ...validationOptions },
      constraints: [],
      validator: IsFutureDateConstraint
    });
};
