import {
  isLatitude,
  isLongitude,
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
export type LongLat = [number, number];

@ValidatorConstraint({ name: 'isLongLat', async: false })
export class IsLongLatConstraint implements ValidatorConstraintInterface {
  validate(coordinates?: any[]): boolean {
    if (!coordinates || coordinates.length !== 2 || !coordinates.every((coordinate) => typeof coordinate === 'number'))
      return false;

    const [long, lat] = coordinates;

    return isLatitude(String(lat)) && isLongitude(String(long));
  }
}

export const IsLongLat = (validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) =>
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: { message: `${propertyName} must be a valid coordinations [long, lat]`, ...validationOptions },
      constraints: [],
      validator: IsLongLatConstraint
    });
};
