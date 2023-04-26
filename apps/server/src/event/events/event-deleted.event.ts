import { DeleteResult } from 'typeorm';

export class EventDeletedEvent {
  constructor(public readonly uuid: string, public readonly deleteResult: DeleteResult) {}
}
