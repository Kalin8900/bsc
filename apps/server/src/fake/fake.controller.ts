import { LogRequest, Monitor } from '@joinus/server/core';
import { Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../auth';
import { CountDto } from './dto/count.dto';
import { FakeService } from './fake.service';

// TODO Add role guard

@Controller('fake')
@ApiTags('Fake')
@AuthGuard('jwt')
@LogRequest()
@Monitor()
export class FakeController {
  constructor(private readonly fakeService: FakeService) {}

  @Post('users/:count')
  users(@Param() { count }: CountDto) {
    return this.fakeService.user(count);
  }

  @Post('categories/:count')
  events(@Param() { count }: CountDto) {
    return this.fakeService.category(count);
  }

  @Post('friends')
  friends() {
    return this.fakeService.friends();
  }

  @Post('interactions')
  interactions() {
    return this.fakeService.interactions();
  }
}
