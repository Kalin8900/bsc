import { WithId } from '@joinus/shared/utils';

export interface Role {
  name: string;
}

export type RoleEntity = WithId<Role>;
