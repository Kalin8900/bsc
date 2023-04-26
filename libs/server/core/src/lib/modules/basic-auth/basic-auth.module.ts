import { Global, Module } from '@nestjs/common';

import { BasicAuthService } from './basic-auth.service';

@Global()
@Module({
  providers: [BasicAuthService],
  exports: [BasicAuthService]
})
export class BasicAuthModule {}
