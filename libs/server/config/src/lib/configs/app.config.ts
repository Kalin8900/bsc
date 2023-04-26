import type { CorsOptions, CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface';
import type { OptionsJson, OptionsUrlencoded } from 'body-parser';
import type { CompressionOptions } from 'compression';

import pjson from '../../../../../../package.json';

export interface AppConfig {
  port: number;
  version: string;
  name: string;
  compression: CompressionOptions;
  bodyParser: {
    json: OptionsJson;
    urlencoded: OptionsUrlencoded;
  };
  stage: AppStage;
  corsOptions: CorsOptions | CorsOptionsDelegate<any>;
  cookieParser: string;
}

export enum AppStage {
  Local = 'LOCAL',
  Dev = 'DEV',
  Prod = 'PROD'
}

export default (): { app: AppConfig } => ({
  app: {
    port: parseInt(process.env.APP_PORT || '8080', 10),
    version: pjson.version,
    name: process.env.APP_NAME || 'joinus-server',
    compression: {},
    bodyParser: {
      json: {
        type: ['json', '+json'],
        limit: '10mb'
      },
      urlencoded: {
        extended: false
      }
    },
    stage: (process.env.APP_STAGE ?? AppStage.Local) as AppStage,
    corsOptions: {
      origin: true,
      credentials: true
    },
    cookieParser: 'secret'
  }
});
