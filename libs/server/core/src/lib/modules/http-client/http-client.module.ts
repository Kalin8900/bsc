import { DynamicModule, Module, Provider } from '@nestjs/common';

import { httpClientFactory } from './http-client.factory';
import { HttpClient, HttpClientConfig, HttpClientModuleOptions, HttpClientOptions } from './http-client.types';

@Module({})
export class HttpClientModule {
  public static forRoot(config: HttpClientConfig): DynamicModule {
    const httpClient = this.createHttpClientProvider();

    return {
      module: HttpClientModule,
      global: true,
      providers: [
        {
          provide: HttpClientOptions,
          useValue: config
        },
        httpClient
      ],
      exports: [HttpClient]
    };
  }

  public static forRootAsync(options: HttpClientModuleOptions): DynamicModule {
    const httpClient = this.createHttpClientProvider();

    return {
      module: HttpClientModule,
      global: true,
      imports: options.imports,
      providers: [
        httpClient,
        {
          provide: HttpClientOptions,
          inject: options.inject,
          useFactory: options.useFactory
        }
      ],
      exports: [httpClient]
    };
  }

  private static createHttpClientProvider(): Provider {
    return {
      provide: HttpClient,
      inject: [HttpClientOptions],
      useFactory: httpClientFactory
    };
  }
}
