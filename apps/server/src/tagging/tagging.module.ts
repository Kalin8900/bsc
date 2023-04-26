import { Module } from '@nestjs/common';

import { EventModule } from '../event';
import { TaggingController } from './tagging.controller';
import { TaggingService } from './tagging.service';

@Module({
  imports: [EventModule],
  controllers: [TaggingController],
  providers: [TaggingService],
  exports: [TaggingService]
})
export class TaggingModule {}
