import { Auth } from '../entities/auth.entity';

export class AuthCreatedEvent extends Auth {
  constructor(auth: Auth) {
    super();
    Object.assign(this, auth);
  }
}
