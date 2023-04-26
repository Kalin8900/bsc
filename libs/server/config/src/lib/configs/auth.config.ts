import { JwtModuleOptions } from '@nestjs/jwt';

export interface AuthConfig {
  github: {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope: string[];
  };
  google: {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope: string[];
  };
  jwt: JwtModuleOptions;
}

export default (): { auth: AuthConfig } => ({
  auth: {
    github: {
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL: process.env.GITHUB_CALLBACK_URL || '',
      scope: ['user:email']
    },
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
      scope: ['profile', 'email']
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'aliens-built-pyramids',
      signOptions: {
        expiresIn: '1d'
      }
    }
  }
});
