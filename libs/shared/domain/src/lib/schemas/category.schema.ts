import { WithUuid } from '@joinus/shared/utils';

export interface Category {
  name: string;
  description: string;
  imageUrl: string | null;
}

export type CategoryEntity = WithUuid<Category>;

export type CategoryEntityRaw = CategoryEntity;
