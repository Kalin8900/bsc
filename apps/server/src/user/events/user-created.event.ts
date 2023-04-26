import { User } from '../entities/user.entity';

export class UserCreatedEvent extends User {
  constructor(user: User) {
    super();
    Object.assign(this, user);
  }
}
