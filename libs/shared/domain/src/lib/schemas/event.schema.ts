import { Point } from '@joinus/server/core';
import { WithCreationDate, WithUuid } from '@joinus/shared/utils';

import { UserEntity, UserEntityRaw } from './user.schema';

export interface Event {
  name: string;
  description: string | null;
  location: Point;
  startDate: Date | null;
}

export interface EventEntity extends WithCreationDate<WithUuid<Event>> {
  author: UserEntity;
}

export interface EventEntityRaw extends Omit<EventEntity, 'createdAt' | 'author'> {
  createdAt: string;
  author: UserEntityRaw;
}
