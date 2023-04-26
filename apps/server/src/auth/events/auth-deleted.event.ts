import { DeleteResult } from 'typeorm';

export class AuthDeletedEvent {
  constructor(public readonly uuid: string, public readonly deleteResult: DeleteResult) {}
}
