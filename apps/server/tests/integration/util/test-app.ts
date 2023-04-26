import { createMock } from '@golevelup/ts-jest';
import { CoreModule, Redis } from '@joinus/server/core';
import { INestApplication, ModuleMetadata } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisClientType } from '@redis/client';
import cookieParser from 'cookie-parser';
import { agent, SuperAgentTest } from 'supertest';
import { DataSource } from 'typeorm';

import { GithubStrategy, GoogleStrategy } from '../../../src/auth';
import { AuthModule } from '../../../src/auth/auth.module';
import { AuthService } from '../../../src/auth/auth.service';

interface Overrides {
  typeOrToken: any;
  value: any;
}

export class TestApp {
  private constructor(public readonly app: INestApplication, public readonly supertest: SuperAgentTest) {}

  public static async create(modulesMetadata: ModuleMetadata, overrides?: Overrides[]) {
    const builder = Test.createTestingModule({
      imports: (modulesMetadata.imports ?? []).concat([
        CoreModule,
        AuthModule,
        EventEmitterModule.forRoot(),
        TypeOrmModule.forRoot()
      ]),
      providers: modulesMetadata.providers
    })
      .overrideProvider(DataSource)
      .useValue(createMock<DataSource>())
      .overrideProvider(Redis)
      .useValue(createMock<RedisClientType>())
      .overrideProvider(GithubStrategy)
      .useValue(createMock<GithubStrategy>())
      .overrideProvider(GoogleStrategy)
      .useValue(createMock<GoogleStrategy>());

    overrides?.forEach((override) => {
      builder.overrideProvider(override.typeOrToken).useValue(override.value);
    });

    const module = await builder.compile();

    const app = module.createNestApplication();

    app.use(cookieParser('secret'));

    await app.init();

    const supertest = agent(app.getHttpServer());

    return new TestApp(app, supertest);
  }

  public async close() {
    await this.app.close();
  }

  public async generateToken(uuid: string): Promise<string> {
    const authService = this.app.get<AuthService>(AuthService);

    return authService.login(uuid);
  }

  public async supertestWithToken(token: string) {
    const supertestWithToken = new Proxy(this.supertest, {
      get: (target, prop) => {
        if (prop === 'get' || prop === 'post' || prop === 'put' || prop === 'delete' || prop === 'patch') {
          return (url: string) => target[prop](url).set('Authorization', `Bearer ${token}`);
        }

        return (target as any)[prop];
      }
    });

    return supertestWithToken;
  }

  public async supertestWithUser(uuid: string) {
    const token = await this.generateToken(uuid);

    return this.supertestWithToken(token);
  }
}
