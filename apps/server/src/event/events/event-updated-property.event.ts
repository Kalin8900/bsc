import { EventEntity } from '@joinus/domain';
import { UpdateResult } from 'typeorm';

export class EventUpdatedPropertyEvent {
  constructor(
    public readonly uuid: string,
    public readonly property: keyof EventEntity,
    public readonly value: EventEntity[keyof EventEntity],
    public readonly updateResult: UpdateResult
  ) {}
}
