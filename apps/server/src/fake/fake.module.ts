import { Module } from '@nestjs/common';

import { CategorizationModule } from '../categorization';
import { CategoryModule } from '../category';
import { EventModule } from '../event';
import { EventInteractionsModule } from '../event-interactions';
import { FriendsModule } from '../friends';
import { TaggingModule } from '../tagging';
import { UserModule } from '../user';
import { FakeController } from './fake.controller';
import { FakeListener } from './fake.listener';
import { FakeService } from './fake.service';

@Module({
  imports: [
    EventModule,
    UserModule,
    FriendsModule,
    EventInteractionsModule,
    CategoryModule,
    TaggingModule,
    CategorizationModule
  ],
  controllers: [FakeController],
  providers: [FakeService, FakeListener]
})
export class FakeModule {}
