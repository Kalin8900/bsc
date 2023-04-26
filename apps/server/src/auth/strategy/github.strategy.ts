import { NotFoundException } from '@joinus/server/base';
import { AuthConfigService } from '@joinus/server/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GithubPassportStrategy, Profile } from 'passport-github2';

import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(GithubPassportStrategy) {
  constructor(readonly authConfigService: AuthConfigService, private readonly authService: AuthService) {
    super(authConfigService.github);
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    try {
      const email = profile.emails?.[0];

      if (!email) {
        throw new NotFoundException('Email not found', [`Email not found for user ${profile.username}`]);
      }

      return await this.authService.validateOAuth(email.value.toLowerCase());
    } catch (err: any) {
      throw new NotFoundException('User not found', [err.message]);
    }
  }
}
