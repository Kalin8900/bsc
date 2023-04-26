import { Global, Module } from '@nestjs/common';

import { Validator } from './validator';

@Global()
@Module({
  providers: [Validator],
  exports: [Validator]
})
export class ValidationModule {}
