import { WithCreationDate, WithUuid } from '@joinus/shared/utils';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export type UserEntity = WithCreationDate<WithUuid<User>>;

export interface UserEntityRaw extends Omit<UserEntity, 'createdAt'> {
  createdAt: string;
}
