import { AppConfigService, SwaggerConfigService } from '@joinus/server/config';
import { Log } from '@joinus/server/core';
import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { useContainer } from 'class-validator';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { AppModule } from './app/app.module';
import { AccessCookie } from './auth';

const globalPrefix = `${process.env.APP_ROUTE_SERVER || ''}/api`;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger()
  });

  const configService = app.get<AppConfigService>(AppConfigService);
  const config = configService.app;

  app.use(bodyParser.json(config.bodyParser.json));
  app.use(bodyParser.urlencoded(config.bodyParser.urlencoded));
  app.use(compression(config.compression));
  app.use(cookieParser(config.cookieParser));
  app.enableCors(configService.cors);

  app.setGlobalPrefix(globalPrefix);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1'
  });

  app.enableShutdownHooks();

  // enable dependency injection in custom validators
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const swaggerConfigService = app.get<SwaggerConfigService>(SwaggerConfigService);

  const documentConfig = new DocumentBuilder()
    .setTitle(config.name)
    .setDescription('JoinUs API description')
    .setVersion(config.version)
    .addBearerAuth()
    .addCookieAuth(AccessCookie)
    .addBasicAuth({ name: 'basic', type: 'http' })
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig, swaggerConfigService.document);
  SwaggerModule.setup('api-docs', app, document, swaggerConfigService.options);

  await app.listen(config.port);
  Log.info(`🚀 Application is running on: http://localhost:${config.port}/${globalPrefix}`);
}

bootstrap().finally(() => 'Done');
