import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as HttpStrategy } from 'passport-http';

import { AuthService } from '../auth.service';

@Injectable()
export class BasicStrategy extends PassportStrategy(HttpStrategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(emailOrPhone: string, password: string) {
    return this.authService.validateUser(emailOrPhone, password);
  }
}
