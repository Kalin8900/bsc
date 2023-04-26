import { DeleteResult } from 'typeorm';

export class UserDeletedEvent {
  constructor(public readonly uuid: string, public readonly deleteResult: DeleteResult) {}
}
