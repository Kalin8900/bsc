import { UserEntity } from '@joinus/domain';
import { UpdateResult } from 'typeorm';

export class UserUpdatedPropertyEvent {
  constructor(
    public readonly uuid: string,
    public readonly property: keyof UserEntity,
    public readonly value: UserEntity[keyof UserEntity],
    public readonly updateResult: UpdateResult
  ) {}
}
