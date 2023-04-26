import { UserEntity } from '@joinus/domain';
import { Request } from 'express';

export interface TokenPayload {
  uuid: string;
}

export interface RequestWithUser extends Request {
  user: UserEntity;
}
