import { SwaggerCustomOptions, SwaggerDocumentOptions } from '@nestjs/swagger';

export interface SwaggerConfig {
  document: SwaggerDocumentOptions;
  options: SwaggerCustomOptions;
}

export default (): { swagger: SwaggerConfig } => ({
  swagger: {
    document: {
      ignoreGlobalPrefix: false,
      deepScanRoutes: true
    },
    options: {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: false
      },
      explorer: true
    }
  }
});
