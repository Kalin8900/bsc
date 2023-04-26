import { WithCreationDate, WithUuid } from '@joinus/shared/utils';

import { RoleEntity } from './role.schema';
import { UserEntity, UserEntityRaw } from './user.schema';

export interface Auth {
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface AuthEntity extends WithCreationDate<WithUuid<Auth>> {
  user?: UserEntity;
  role?: RoleEntity;
}

export interface AuthEntityRaw extends Omit<AuthEntity, 'createdAt' | 'user'> {
  createdAt: string;
  user?: UserEntityRaw;
}
