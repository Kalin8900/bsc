import { User } from '../entities/user.entity';

export class UserUpdatedEvent extends User {
  constructor(user: User) {
    super();
    Object.assign(this, user);
  }
}
