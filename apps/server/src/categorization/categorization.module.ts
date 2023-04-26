import { Module } from '@nestjs/common';

import { CategoryModule } from '../category';
import { EventModule } from '../event';
import { CategorizationController } from './categorization.controller';
import { CategorizationService } from './categorization.service';

@Module({
  imports: [EventModule, CategoryModule],
  controllers: [CategorizationController],
  providers: [CategorizationService],
  exports: [CategorizationService]
})
export class CategorizationModule {}
