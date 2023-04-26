import { Auth } from '../entities/auth.entity';

export class AuthPasswordChangedEvent extends Auth {
  constructor(auth: Auth) {
    super();
    Object.assign(this, auth);
  }
}
