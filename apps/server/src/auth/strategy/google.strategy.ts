import { NotFoundException } from '@joinus/server/base';
import { AuthConfigService } from '@joinus/server/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GooglePassportStrategy, Profile } from 'passport-google-oauth20';

import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(GooglePassportStrategy) {
  constructor(readonly authConfigService: AuthConfigService, private readonly authService: AuthService) {
    super(authConfigService.google);
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    try {
      const email = profile.emails?.[0];

      if (!email) {
        throw new NotFoundException('Email not found', [`Email not found for user ${profile.username}`]);
      }

      return await this.authService.validateOAuth(email.value.toLowerCase(), {
        firstName: profile.name?.givenName,
        lastName: profile.name?.familyName
      });
    } catch (err: any) {
      throw new NotFoundException('User not found', [err.message]);
    }
  }
}
